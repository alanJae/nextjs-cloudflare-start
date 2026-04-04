'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export default function ContactPage() {
    const t = useTranslations('contact');
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus({
                    type: 'success',
                    message: t('form.successMessage'),
                });
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || t('form.errorMessage'),
                });
            }
        } catch {
            setSubmitStatus({
                type: 'error',
                message: t('form.errorMessage'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t('description')}
                </p>
            </header>

            <section className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('info.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <article>
                            <h3 className="font-medium mb-2">{t('info.email.title')}</h3>
                            <p className="text-muted-foreground">{t('info.email.description')}</p>
                        </article>
                        <article>
                            <h3 className="font-medium mb-2">{t('info.response.title')}</h3>
                            <p className="text-muted-foreground">{t('info.response.description')}</p>
                        </article>
                        <article>
                            <h3 className="font-medium mb-2">{t('info.support.title')}</h3>
                            <p className="text-muted-foreground">{t('info.support.description')}</p>
                        </article>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('reasons.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3" role="list">
                            <li className="flex items-start">
                                <span className="mr-2 text-primary" aria-hidden="true">•</span>
                                <p className="text-muted-foreground">{t('reasons.reason1')}</p>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary" aria-hidden="true">•</span>
                                <p className="text-muted-foreground">{t('reasons.reason2')}</p>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary" aria-hidden="true">•</span>
                                <p className="text-muted-foreground">{t('reasons.reason3')}</p>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary" aria-hidden="true">•</span>
                                <p className="text-muted-foreground">{t('reasons.reason4')}</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <section className="mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('form.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" aria-label={t('form.title')}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        {t('form.name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder={t('form.namePlaceholder')}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        {t('form.email')}
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder={t('form.emailPlaceholder')}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">
                                    {t('form.message')} <span className="text-red-500">*</span>
                                </Label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('form.messagePlaceholder')}
                                    disabled={isSubmitting}
                                    rows={6}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {submitStatus.type && (
                                <div
                                    className={`p-4 rounded-md ${submitStatus.type === 'success'
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                                        }`}
                                >
                                    {submitStatus.message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                size="lg"
                                className="w-full md:w-auto"
                                aria-label={isSubmitting ? t('form.submitting') : t('form.submit')}
                            >
                                {isSubmitting ? t('form.submitting') : t('form.submit')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
