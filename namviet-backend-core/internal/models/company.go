package models

import (
	"time"
)

type Company struct {
	ID                 string    `json:"id"` // UUID
	TaxCode            string    `json:"tax_code"`
	Name               string    `json:"name"`
	ShortName          *string   `json:"short_name"`
	Address            string    `json:"address"`
	Phone              string    `json:"phone"`
	Email              *string   `json:"email"`
	LogoUrl            *string   `json:"logo_url"`
	RepresentativeName *string   `json:"representative_name"`
	BusinessLicenseUrl []string  `json:"business_license_url"` // ARRAY
	Mission            *string   `json:"mission"`
	Vision             *string   `json:"vision"`
	Status             string    `json:"status"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
	DeletedAt          *time.Time `json:"deleted_at"`
}
