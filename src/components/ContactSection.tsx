import React from 'react';
import { Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { contactData } from '../data/contact';

export const ContactSection: React.FC = () => {
  const sanitizedPhone = contactData.phone.replace(/\s+/g, '');
  const encodedPhone = encodeURIComponent(sanitizedPhone);

  const contactMethods = [
    {
      id: 'email',
      label: 'Email',
      value: contactData.email,
      actionText: 'Send an email',
      href: `mailto:${contactData.email}`,
      icon: Mail,
      isExternal: false,
    },
    {
      id: 'phone',
      label: 'Phone',
      value: contactData.phone,
      actionText: 'Direct call',
      href: `tel:${sanitizedPhone}`,
      icon: Phone,
      isExternal: false,
    },
    {
      id: 'viber',
      label: 'Viber',
      value: contactData.viber,
      actionText: 'Open Viber chat',
      href: `viber://chat?number=${encodedPhone}`,
      icon: MessageSquare,
      isExternal: true,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      value: contactData.facebookUsername ? `@${contactData.facebookUsername}` : contactData.facebook,
      actionText: 'View profile / message',
      href: contactData.facebook,
      icon: ExternalLink,
      isExternal: true,
    },
  ];

  return (
    <section className="py-8 sm:py-10 space-y-8" aria-labelledby="contact-heading">
      <div className="space-y-2 border-b border-neutral-200/80 pb-5">
        <h2
          id="contact-heading"
          className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900"
        >
          {contactData.heading}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
          {contactData.invitation}
        </p>
      </div>

      {/* Desktop: Horizontal 4-col arrangement | Mobile: 2x2 grid with 12px rounded items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {contactMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <a
              key={method.id}
              href={method.href}
              target={method.isExternal ? '_blank' : undefined}
              rel={method.isExternal ? 'noopener noreferrer' : undefined}
              className="group block p-4 sm:p-5 bg-white border border-neutral-200/90 rounded-xl hover:border-neutral-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              aria-label={`${method.label}: ${method.actionText}`}
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 border border-neutral-200/90 rounded-lg text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                    ↗
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    {method.label}
                  </span>
                  <div className="text-xs sm:text-sm font-semibold text-neutral-900 break-all line-clamp-1">
                    {method.value}
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">
                    {method.actionText}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
