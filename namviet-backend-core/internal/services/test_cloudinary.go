package services

import (
	"context"
	"fmt"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func TestCloudinary() error {
	cld, _ := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	
	// Upload 1 file giả lập (Sếp có thể trỏ đến 1 ảnh bất kỳ trên máy tính)
	resp, err := cld.Upload.Upload(context.Background(), "test_image.jpg", uploader.UploadParams{
		Folder: "test_namviet",
	})
	if err != nil {
		return err
	}
	fmt.Println("✅ Cloudinary thông! URL ảnh:", resp.SecureURL)
	return nil
}