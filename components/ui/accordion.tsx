'use client';

import * as React from 'react';

export function Accordion({ children, className }: React.PropsWithChildren<{ type?: 'single' | 'multiple'; collapsible?: boolean; className?: string }>) {
  return <div className={className}>{children}</div>;
}

export function AccordionItem({ children }: React.PropsWithChildren<{ value: string }>) {
  return <div className="border-b py-2">{children}</div>;
}

export function AccordionTrigger({ children }: React.PropsWithChildren<{}>) {
  return <div className="cursor-pointer py-2 font-medium">{children}</div>;
}

export function AccordionContent({ children }: React.PropsWithChildren<{}>) {
  return <div className="py-2">{children}</div>;
}

