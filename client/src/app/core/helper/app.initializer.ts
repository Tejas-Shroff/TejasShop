import { map } from "rxjs";
import { AuthService } from "../Services/auth.service";


export function appInitializer(authService: AuthService): () => Promise<void> {
    return () =>
        new Promise((resolve) => {
            authService.refreshUser().subscribe(() => { // here we are refreshing the token 
                resolve()
            });
        })
}