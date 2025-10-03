import React from 'react';
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm min-h-[120px]" {...props} />;
}
