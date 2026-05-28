package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/namviet/backend-core/internal/models"
	"github.com/namviet/backend-core/internal/repositories"
)

type WarehouseHandler struct {
	repo *repositories.WarehouseRepository
}

func NewWarehouseHandler(repo *repositories.WarehouseRepository) *WarehouseHandler {
	return &WarehouseHandler{repo: repo}
}

func (h *WarehouseHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	warehouses, err := h.repo.FindAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(warehouses)
}

func (h *WarehouseHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "ID không hợp lệ", http.StatusBadRequest)
		return
	}

	warehouse, err := h.repo.FindByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(warehouse)
}

func (h *WarehouseHandler) Create(w http.ResponseWriter, r *http.Request) {
	var wh models.Warehouse
	if err := json.NewDecoder(r.Body).Decode(&wh); err != nil {
		http.Error(w, "Dữ liệu đầu vào không hợp lệ", http.StatusBadRequest)
		return
	}

	if err := h.repo.Create(r.Context(), &wh); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(wh)
}

func (h *WarehouseHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "ID không hợp lệ", http.StatusBadRequest)
		return
	}

	var wh models.Warehouse
	if err := json.NewDecoder(r.Body).Decode(&wh); err != nil {
		http.Error(w, "Dữ liệu đầu vào không hợp lệ", http.StatusBadRequest)
		return
	}
	wh.ID = id

	if err := h.repo.Update(r.Context(), &wh); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(wh)
}

func (h *WarehouseHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "ID không hợp lệ", http.StatusBadRequest)
		return
	}

	if err := h.repo.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
