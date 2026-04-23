import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    try {
        const { client_id, customer_id } = await request.json();

        const { data, error } = await supabase
            .from("leap_document_type")
            .select("document_type_id, document_name, is_deleted")
            .eq("document_type_id", 5)
            .eq("is_deleted", false);

        if (error) {
            return funSendApiErrorMessage(error, "Unable to fetch personal document types");
        }

        return NextResponse.json({
            status: 1,
            message: "Employee Personal Document Types",
            data: data || []
        }, { status: apiStatusSuccessCode });

    } catch (error) {
        return funSendApiException(error);
    }
}
