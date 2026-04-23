
import { NextRequest, NextResponse } from "next/server";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        let responseData;
        const formData = await request.formData();
        const data = {
            customer_UUID: formData.get('customer_UUID') as string,
            newPassword: formData.get('newPassword') as string,
          }
        // here code will come for leap customer 

          const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

          const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${data.customer_UUID}`, {
              method: 'PUT',
              headers: {
                  Authorization: `Bearer ${serviceRoleKey}`,
                  apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
                  'Content-Type': 'application/json',
                },
              body: JSON.stringify({ password: data.newPassword }),
            });
          
            const result = await response.json();

          if (!response.ok) {
            return NextResponse.json(
              { status: 0, message: result?.msg || result?.message || "Password update failed" },
              { status: response.status }
            );
          }

    return NextResponse.json({ status: 1, message: "Password updated successfully", data: "" }, { status: apiStatusSuccessCode });
    }catch(error){
        return funSendApiException(error);
        
    }
}

