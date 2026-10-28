# Authentication and sessions

| Path | Method | Purpose | Permission | Body | Success |
| --- | --- | --- | --- | --- | --- |
| `/api/auth/pubkey` | GET | Public key | Public | None |200 plain ok/pubkey |
| `/api/auth/register` | POST | Register | Valid invitation | username,password,invite_code; optional display_name |201 user wrapper, no session |
| `/api/auth/login` | POST | Login | Public | username,password |200 user/access_token/refresh_token |
| `/api/auth/refresh` | POST | Rotate tokens | Refresh token | refresh_token |200 user/access_token/refresh_token |
| `/api/auth/me` | GET | Current user | Login | None |200 user wrapper |
| `/api/auth/profile` | PATCH | Update display name | Login | display_name |200 user wrapper |
| `/api/auth/logout` | POST | Revoke matching session | Login | latest refresh_token |204 |
| `/api/auth/password` | PATCH | Change password/revoke all sessions | Login | old_password,new_password |204 |

Registration requires separate login. User fields are id,username,display_name,role; profile response also includes status. Passwords for registration/change require at least8 characters, at most200 characters and72 UTF-8 bytes. Username80,display_name100,invite_code100; display_name may be empty.

Refresh rotates refresh_token while keeping the session ID; serialize refresh requests and replace both returned tokens. Old access tokens may remain valid while their shared session exists. Logout deletes the current user session matching the supplied refresh-token hash; unmatched/stale tokens still return204, so204 alone does not prove the Bearer session was revoked. Clear local tokens on success. Password changes and account disablement revoke all user sessions. Default access/refresh lifetimes are configurable2h/7d. See [encryption](./overview.md) and [full authentication fields](/api/auth).
