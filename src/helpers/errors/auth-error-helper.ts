import { HttpMessagesEnum } from "@/enums/httpMessages.enum";
import { ErrorHelper } from "./error-helper";
import { swalNotifyError } from "../swal/swal-notify-error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AuthErrorHelper(error: any) {
    if (error.message === HttpMessagesEnum.INSUFFICIENT_PERMISSIONS) {

        swalNotifyError(new ErrorHelper(HttpMessagesEnum.INSUFFICIENT_PERMISSIONS, "Cerrando sesion")).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/pageUser";

          }
        });

      } else if (error.message === HttpMessagesEnum.TOKEN_EXPIRED) {

        swalNotifyError(new ErrorHelper(HttpMessagesEnum.TOKEN_EXPIRED, "Cerrando sesion")).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";

          }
        });;

        localStorage.clear();

      } else if (error.message === HttpMessagesEnum.RESTAURANT_NOT_FOUND) {

        swalNotifyError(new ErrorHelper(HttpMessagesEnum.NOT_ALLOWED_HERE, "Cerrando sesion")).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/pageUser";

          }
        });

      } else if (error.message !== HttpMessagesEnum.UNKNOWN_ERROR) {
        swalNotifyError(error);

      }
}