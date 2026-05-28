package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/namviet/backend-core/internal/models"
	"github.com/namviet/backend-core/internal/repositories"
	"github.com/namviet/backend-core/internal/services"
)

type UserHandler struct {
	repo        *repositories.UserRepository
	authService *services.AuthService
}

func NewUserHandler(repo *repositories.UserRepository, authService *services.AuthService) *UserHandler {
	return &UserHandler{
		repo:        repo,
		authService: authService,
	}
}

func (h *UserHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	users, err := h.repo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		FullName    string `json:"full_name"`
		Phone       string `json:"phone"`
		RoleID      string `json:"role_id"`
		CompanyID   string `json:"company_id"`
		WarehouseID int64  `json:"warehouse_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 1. Create in Supabase Auth
	authID, err := h.authService.CreateUser(payload.Email, payload.Password, payload.FullName)
	if err != nil {
		http.Error(w, "Failed to create user in Auth: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var roleIDPtr *string
	if payload.RoleID != "" {
		roleIDPtr = &payload.RoleID
	}

	var companyIDPtr *string
	if payload.CompanyID != "" {
		companyIDPtr = &payload.CompanyID
	}

	var warehouseIDPtr *int64
	if payload.WarehouseID != 0 {
		warehouseIDPtr = &payload.WarehouseID
	}

	// 2. Create in public.users table
	user := &models.User{
		ID:          authID,
		Email:       &payload.Email,
		FullName:    &payload.FullName,
		Phone:       &payload.Phone,
		RoleID:      roleIDPtr,
		CompanyID:   companyIDPtr,
		WarehouseID: warehouseIDPtr,
		Status:      "active", // or pending_approval based on business logic
	}

	if err := h.repo.CreateProfile(user); err != nil {
		// Note: In production, you might want to rollback the auth creation here
		http.Error(w, "Failed to create user profile: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}
