import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "../utils/supabase/middleware";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middel waare is getting called ---------------------------------- ----- -- ",pathname);
  const isAdmin = request.cookies.get("isAdmin")?.value;
  console.log("Middel waare is getting called ---------------------------------- ----- -- ",isAdmin);

  // if(isAdmin){
  //   if (request.nextUrl.pathname.startsWith("/user") && isAdmin.toString()=="true") {
  //       console.log("Middel waare is getting called ----",isAdmin);
      
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }else{
      
  //     return NextResponse.redirect(new URL("/user/dashboard", request.url));
      
  //   }
  // }

  const lowerPath = pathname.toLowerCase();
  const allowList = [ 
      "/login",
      "/forgot-password",
      "/reset-password",
      "/reset-pass/verify-token",
      "/clientadmin/addemployeeform",
      "/terms-and-conditions",
      "/privacy-policy",
      "/clientadmin/addemployeeform/addemployeebankdetailsform",
      "/whats-app/add-task",
      "/whats-app/raise-support",
      "/whats-app/upload-documents",
      "/whats-app/apply-leave",
      "/whats-app",
      "/whats-app/leave-details",
      "/whats-app/support-details",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/update-password",
      "/api/users/getUserProfile",
      "/api/users/updateEmployee",
      "/api/users/resetUserDeviceID",
      "/api/client/getClients",
      "/api/users/addTask",
      "/api/users/getTaskTypes",
      "/api/users/getTaskStatus",
      "/api/users/project/getProjectSubProject",
      "/api/users/project/addProject",
      "/api/users/project/addSubProject",
      "/api/users/applyLeave",
      "/api/users/updateAppliedLeave",
      "/api/users/showLeaveType",
      "/api/users/getLeaveBalance",
      "/api/users/support/raiseSupport",
      "/api/users/support/supportList",
      "/api/UploadFiles",
      "/api/UploadFiles/uploadDocuments",
      "/api/clientAdmin/get_supportrequest",
      "/api/clientAdmin/mark_emp_attendance",
      "/api/updateAttendanceLocation",
      "/api/chatBot/addTask",
      "/api/chatBot/markAttendance",
      "/api/chatBot/userVerificationCheck",
      "/api/chatBot/webPageForm",
      "/firebase-messaging-sw.js"
    ];

  // ✅ Allow password reset & confirmation pages to be accessed
  if (pathname === "/" || allowList.some(p => lowerPath.includes(p))) {
      return NextResponse.next();
  }

  // ✅ Role-based URL guard — redirect users who navigate to wrong-role pages
  const roleId = request.cookies.get("role_id")?.value;
  const adminToggle = request.cookies.get("isAdmin")?.value;
  const isAdminRole = roleId && ["1", "2", "3"].includes(roleId);
  const isEmployeeRole = roleId && ["4", "5", "9"].includes(roleId);

  // Block employees/managers from accessing admin pages
  if (isEmployeeRole && (lowerPath.startsWith("/dashboard") || lowerPath.startsWith("/clientadmin"))) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  // Block admins from accessing employee pages (unless they toggled into employee view)
  if (isAdminRole && lowerPath.startsWith("/user") && adminToggle !== "false") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Apply session update for all other routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
  ],
};