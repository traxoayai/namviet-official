package repositories

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/namviet/backend-core/internal/models"
)

type CompanyRepository struct {
	db *sql.DB
}

func NewCompanyRepository(db *sql.DB) *CompanyRepository {
	return &CompanyRepository{db: db}
}

func (r *CompanyRepository) FindAll(ctx context.Context) ([]models.Company, error) {
	query := `SELECT id, tax_code, name, short_name, address, phone, email, logo_url, representative_name, array_to_json(business_license_url), mission, vision, status, created_at, updated_at FROM companies WHERE deleted_at IS NULL ORDER BY created_at DESC`
	
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var companies []models.Company
	for rows.Next() {
		var c models.Company
		var licenseBytes []byte // Chứa chuỗi JSON mảng
		err := rows.Scan(
			&c.ID, &c.TaxCode, &c.Name, &c.ShortName, &c.Address, &c.Phone, &c.Email, 
			&c.LogoUrl, &c.RepresentativeName, &licenseBytes, &c.Mission, &c.Vision, 
			&c.Status, &c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		
		if licenseBytes != nil {
			_ = json.Unmarshal(licenseBytes, &c.BusinessLicenseUrl)
		}
		companies = append(companies, c)
	}

	return companies, nil
}

func (r *CompanyRepository) Create(ctx context.Context, c *models.Company) error {
	query := `
		INSERT INTO companies (tax_code, name, short_name, address, phone, email, logo_url, representative_name, business_license_url, mission, vision, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRowContext(ctx, query, 
		c.TaxCode, c.Name, c.ShortName, c.Address, c.Phone, c.Email, 
		c.LogoUrl, c.RepresentativeName, c.BusinessLicenseUrl, c.Mission, c.Vision, c.Status,
	).Scan(&c.ID, &c.CreatedAt, &c.UpdatedAt)

	return err
}

func (r *CompanyRepository) Update(ctx context.Context, c *models.Company) error {
	query := `
		UPDATE companies
		SET tax_code = $1, name = $2, short_name = $3, address = $4, phone = $5, email = $6, 
		    logo_url = $7, representative_name = $8, business_license_url = $9, mission = $10, vision = $11, 
			status = $12, updated_at = NOW()
		WHERE id = $13 AND deleted_at IS NULL
	`
	res, err := r.db.ExecContext(ctx, query,
		c.TaxCode, c.Name, c.ShortName, c.Address, c.Phone, c.Email, 
		c.LogoUrl, c.RepresentativeName, c.BusinessLicenseUrl, c.Mission, c.Vision, c.Status,
		c.ID,
	)
	if err != nil {
		return err
	}
	
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("không tìm thấy công ty hoặc công ty đã bị xóa")
	}

	return nil
}

func (r *CompanyRepository) Delete(ctx context.Context, id string) error {
	// Soft delete
	query := `UPDATE companies SET deleted_at = NOW() WHERE id = $1`
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}
	
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("không tìm thấy công ty")
	}
	return nil
}
