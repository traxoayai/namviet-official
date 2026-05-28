package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadImage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Ensure we only handle POST
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse form up to 10 MB
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Unable to get image file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		http.Error(w, "Cloudinary config error", http.StatusInternalServerError)
		return
	}

	resp, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{
		Folder: "namviet_uploads",
	})
	if err != nil {
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		return
	}

	// Trả về secure_url
	json.NewEncoder(w).Encode(map[string]string{
		"url": resp.SecureURL,
	})
}
