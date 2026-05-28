package services

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

func TestFirebase() error {
	ctx := context.Background()
	opt := option.WithCredentialsFile(os.Getenv("FIREBASE_CREDENTIALS_PATH"))
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return fmt.Errorf("lỗi khởi tạo Firebase App: %v", err)
	}

	client, err := app.Messaging(ctx)
	if err != nil {
		return fmt.Errorf("lỗi khởi tạo Firebase Messaging: %v", err)
	}

	// Token của điện thoại Sếp (lấy từ ứng dụng mobile khi đã đăng nhập)
	registrationToken := "TOKEN_THIET_BI_CUA_SEP" 

	message := &messaging.Message{
		Notification: &messaging.Notification{
			Title: "Test Kết nối Nam Việt",
			Body:  "Sếp ơi, hệ thống đã kết nối thông!",
		},
		Token: registrationToken,
	}

	_, err = client.Send(ctx, message)
	if err != nil {
		return fmt.Errorf("lỗi khi gửi thông báo: %v", err)
	}
	fmt.Println("✅ Firebase thông! Đang gửi thông báo tới điện thoại Sếp...")
	return nil
}