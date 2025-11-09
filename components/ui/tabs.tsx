"use client";
import * as React from "react";
import clsx from "clsx";
type TabsContextType={value:string;setValue:(v:string)=>void}; const TabsCtx=React.createContext<TabsContextType|null>(null);
export function Tabs({defaultValue,children}:{defaultValue:string;children:React.ReactNode}){const[value,setValue]=React.useState(defaultValue);return <TabsCtx.Provider value={{value,setValue}}>{children}</TabsCtx.Provider>}
export function TabsList({className,...props}:{className?:string} & React.HTMLAttributes<HTMLDivElement>){return <div className={clsx("inline-flex gap-2 p-1 rounded-xl",className)} {...props}/>}
export function TabsTrigger({value,children,className}:{value:string;children:React.ReactNode;className?:string}){const ctx=React.useContext(TabsCtx)!;const active=ctx.value===value;return <button onClick={()=>ctx.setValue(value)} className={clsx("px-4 py-2 rounded-lg text-sm transition", active?"bg-red-600 text-white":"text-white/80 hover:bg-white/10 border border-white/10", className)}>{children}</button>}
export function TabsContent({value,className,children}:{value:string;className?:string;children:React.ReactNode}){const ctx=React.useContext(TabsCtx)!;if(ctx.value!==value)return null;return <div className={className}>{children}</div>}
