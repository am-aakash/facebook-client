export class AuthResponse{
    success: boolean = false;
    token: string = "";
    message: string = "";
    userId: string = "";
}

// {
//     "success": true,
//     "token": "2b9a823c-aa6c-43b1-b48e-c1386cf27d3a",
//     "message": "User logged in successfully",
//     "userId": "2b9a823c-aa6c-43b1-b48e-c1386cf27d3a"
// }