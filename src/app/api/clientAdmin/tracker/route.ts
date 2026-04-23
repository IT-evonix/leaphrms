import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const date = formData.get('date');
    const attendance_id = formData.get('attendance_id');

    const formattedDate = date ? String(date) : formatDateYYYYMMDD(new Date());

    let query = supabase.from("leap_customer_attendance")
      .select('*,leap_working_type(*),leap_customer_attendance_geolocation(*)')
      .eq('date', formattedDate);

    if (attendance_id) {
      query = query.eq('attendance_id', String(attendance_id));
    }

    const { data: totalemployeeData, error } = await query;
    if (error) {
      return funSendApiErrorMessage("Failed to get data", error);
    }

    return NextResponse.json({
      message: "Attendance Data",
      status: 1,
      data: totalemployeeData,
    }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}
