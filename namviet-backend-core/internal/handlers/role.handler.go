package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/namviet/backend-core/internal/models"
	"github.com/namviet/backend-core/internal/repositories"
)

type RoleHandler struct {
	repo *repositories.RoleRepository
}

func NewRoleHandler(repo *repositories.RoleRepository) *RoleHandler {
	return &RoleHandler{repo: repo}
}

func (h *RoleHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	roles, err := h.repo.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roles)
}

func (h *RoleHandler) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Permissions []string `json:"permissions"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	role := &models.Role{
		Name:        payload.Name,
		Description: payload.Description,
	}

	if err := h.repo.Create(role, payload.Permissions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(role)
}
