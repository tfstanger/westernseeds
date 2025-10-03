import React from 'react';
export function Card({className='', ...props}:{className?:string}&React.HTMLAttributes<HTMLDivElement>){
  return <div className={`rounded-xl border border-neutral-200 bg-white ${className}`} {...props} />;
}
export function CardHeader({className='', ...props}:{className?:string}&React.HTMLAttributes<HTMLDivElement>){
  return <div className={`p-4 ${className}`} {...props} />;
}
export function CardTitle({className='', ...props}:{className?:string}&React.HTMLAttributes<HTMLHeadingElement>){
  return <h3 className={`text-xl font-semibold ${className}`} {...props} />;
}
export function CardContent({className='', ...props}:{className?:string}&React.HTMLAttributes<HTMLDivElement>){
  return <div className={`p-4 ${className}`} {...props} />;
}
