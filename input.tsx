import React from 'react';
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" {...props} />;
}
