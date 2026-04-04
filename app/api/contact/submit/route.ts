import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface RequestMetadata {
    ip: string;
    userAgent: string;
    language: string;
    timestamp: string;
}

interface FeishuCardMessage {
    msg_type: 'interactive';
    card: {
        elements: Array<{
            tag: 'div';
            text: {
                content: string;
                tag: 'lark_md';
            };
        }>;
        header: {
            template: 'blue';
            title: {
                content: string;
                tag: 'plain_text';
            };
        };
    };
}

async function sendToFeishu(contactData: ContactFormData, metadata: RequestMetadata) {
    const webhookUrl = process.env.FEISHU_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('FEISHU_WEBHOOK_URL is not configured');
        return;
    }

    const elements: FeishuCardMessage['card']['elements'] = [];

    if (contactData.name) {
        elements.push({
            tag: 'div',
            text: {
                content: `**姓名：** ${contactData.name}`,
                tag: 'lark_md',
            },
        });
    }

    if (contactData.email) {
        elements.push({
            tag: 'div',
            text: {
                content: `**邮箱：** ${contactData.email}`,
                tag: 'lark_md',
            },
        });
    }

    elements.push({
        tag: 'div',
        text: {
            content: `**💬 留言内容：**\n${contactData.message}`,
            tag: 'lark_md',
        },
    });

    elements.push({
        tag: 'div',
        text: {
            content: `**⏰ 提交时间：** ${metadata.timestamp}`,
            tag: 'lark_md',
        },
    });

    const message: FeishuCardMessage = {
        msg_type: 'interactive',
        card: {
            elements,
            header: {
                template: 'blue',
                title: {
                    content: '📬 Test Edge Start - 新的联系消息',
                    tag: 'plain_text',
                },
            },
        },
    };

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(`Feishu API returned ${response.status}: ${responseText}`);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();

        if (!body.message?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Message is required' },
                { status: 400 }
            );
        }

        if (body.name && body.name.length > 100) {
            return NextResponse.json(
                { success: false, error: 'Name is too long (max 100 characters)' },
                { status: 400 }
            );
        }

        if (body.email && body.email.length > 254) {
            return NextResponse.json(
                { success: false, error: 'Email is too long (max 254 characters)' },
                { status: 400 }
            );
        }

        if (body.message.length > 2000) {
            return NextResponse.json(
                { success: false, error: 'Message is too long (max 2000 characters)' },
                { status: 400 }
            );
        }

        let ip =
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            request.headers.get('cf-connecting-ip') ||
            'Unknown';

        ip = ip.split(',')[0].trim();

        if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
            ip = 'localhost';
        }

        const metadata: RequestMetadata = {
            ip,
            userAgent: request.headers.get('user-agent') || 'Unknown',
            language: request.headers.get('accept-language') || 'Unknown',
            timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        };

        console.log('Contact form received:', {
            name: body.name,
            email: body.email,
            messageLength: body.message.length,
            ip: metadata.ip,
            userAgent: metadata.userAgent,
            language: metadata.language,
            timestamp: new Date().toISOString(),
        });

        try {
            await sendToFeishu(body, metadata);
        } catch (error) {
            console.error('Failed to send contact message to Feishu:', error);
        }

        return NextResponse.json({
            success: true,
            message: 'Contact message submitted successfully',
        });
    } catch (error) {
        console.error('Submit contact error:', error);

        return NextResponse.json(
            { success: false, error: 'Failed to submit contact message' },
            { status: 500 }
        );
    }
}
