import LoadingScreen from "@/components/Redirect/LoadingScreen";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function Loading() {

    return (
        <UserProvider>
            <LoadingScreen/>
        </UserProvider>
    );
}
