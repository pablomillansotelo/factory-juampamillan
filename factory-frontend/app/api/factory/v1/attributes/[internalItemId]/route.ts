import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { applyRateLimit, addRateLimitHeaders } from '@/lib/rate-limit-helper';

const FACTORY_API_URL = process.env.FACTORY_API_URL || 'http://localhost:8000';
const FACTORY_API_KEY = process.env.FACTORY_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { internalItemId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { response: rateLimitResponse, rateLimitResult } = await applyRateLimit(request, 'get');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const response = await fetch(`${FACTORY_API_URL}/v1/attributes/${params.internalItemId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': FACTORY_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener atributos' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return addRateLimitHeaders(NextResponse.json(data), rateLimitResult);
  } catch (error: any) {
    console.error('Error en GET /api/factory/v1/attributes/[internalItemId]:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener atributos' },
      { status: 500 }
    );
  }
}

