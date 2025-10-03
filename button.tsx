import React from 'react';
export function Button(
  {className='', variant='default', ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'default'|'outline'}
){
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition';
  const styles = variant==='outline' ? 'border border-neutral-300 bg-white hover:bg-neutral-50' : 'text-white bg-[var(--brand)] hover:opacity-90';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
