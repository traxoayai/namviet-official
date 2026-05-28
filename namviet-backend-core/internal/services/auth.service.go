package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type AuthService struct {
	supabaseURL    string
	serviceRoleKey string
}

func NewAuthService() *AuthService {
	return &AuthService{
		supabaseURL:    os.Getenv("SUPABASE_URL"),
		serviceRoleKey: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
	}
}

// CreateUser creates a user in Supabase Auth using the Admin API
func (s *AuthService) CreateUser(email string, password string, fullName string) (string, error) {
	if s.supabaseURL == "" || s.serviceRoleKey == "" {
		return "", fmt.Errorf("missing supabase credentials in environment")
	}

	url := fmt.Sprintf("%s/auth/v1/admin/users", s.supabaseURL)

	payload := map[string]interface{}{
		"email":          email,
		"password":       password,
		"email_confirm":  true,
		"user_metadata":  map[string]string{"full_name": fullName},
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", s.serviceRoleKey)
	req.Header.Set("Authorization", "Bearer "+s.serviceRoleKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("failed to create user in auth: status %d", resp.StatusCode)
	}

	var result struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.ID, nil
}
