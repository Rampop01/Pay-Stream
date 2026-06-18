import React from 'react';

export const DataTable = ({ columns, data }: any) => <table className='w-full'><thead><tr>{columns.map((c:any)=><th key={c}>{c}</th>)}</tr></thead><tbody>{data.map((r:any, i:number)=><tr key={i}>{columns.map((c:any)=><td key={c}>{r[c]}</td>)}</tr>)}</tbody></table>;