import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    try {
        const { client_id, customer_id, status } = await request.json();

        if (status !== undefined) {
            const { error: updateError } = await supabase
                .from("leap_customer")
                .update({ notification_enabled: status })
                .eq('client_id', client_id)
                .eq('customer_id', customer_id);

            if (updateError) {
                return funSendApiErrorMessage(updateError, "Settings update failed");
            }
        }

        const { data, error } = await supabase
            .from("leap_customer")
            .select("customer_id, name, notification_enabled")
            .eq('client_id', client_id)
            .eq('customer_id', customer_id);

        if (error) {
            return NextResponse.json({ message: apiwentWrong, error }, { status: apiStatusFailureCode });
        }

        return NextResponse.json({
            message: "App settings fetched successfully", status: 1,
            data: { data, privacyPolicy: "https://v2.leaphrms.com/privacyPolicy", termsAndConditions: "https://v2.leaphrms.com/termsAndconditions" }
        }, { status: apiStatusSuccessCode });

    } catch (error) {
        return funSendApiException(error);
    }
}