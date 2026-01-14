import { firebaseConfig } from "./config"
import { socialLoginConfig } from "./config"

export const environment = {
    firebaseConfig,
    ...socialLoginConfig,
}
