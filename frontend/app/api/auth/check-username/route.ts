import { NextRequest, NextResponse } from 'next/server';

import { normalizeUsername, validateUsername } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const rawUsername = request.nextUrl.searchParams.get('username') ?? '';
  const username = normalizeUsername(rawUsername);
  const validationError = validateUsername(username);

  if (validationError) {
    return NextResponse.json(
      { available: false, message: validationError },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .limit(1);

    if (error) {
      return NextResponse.json(
        { available: false, message: 'Unable to check username right now.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ available: data.length === 0 });
  } catch {
    return NextResponse.json(
      { available: false, message: 'Unable to check username right now.' },
      { status: 500 }
    );
  }
}
