/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Component, type ReactNode } from 'react'

type ReactJSXElementConstructor<Props> =
  | ((props: Props) => ReactNode | Promise<ReactNode>)
  | (new (props: Props) => Component<Props, any>)

declare global {
  namespace React.JSX {
    type ElementType = string | ReactJSXElementConstructor<any>
  }

  namespace NodeJS {
    interface ProcessEnv {
      CLERK_SECRET_KEY: string
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
      DATABASE_URL: string
      NEXT_PUBLIC_SANITY_PROJECT_ID: string
      NEXT_PUBLIC_SANITY_DATASET: string
      NEXT_PUBLIC_SANITY_USE_CDN: 'true' | 'false'
      NEXT_PUBLIC_SITE_URL: string
      NEXT_PUBLIC_SITE_EMAIL_FROM: string
      NEXT_PUBLIC_SITE_EMAIL_TO: string
      RESEND_API_KEY: string
      UPSTASH_REDIS_REST_URL: string
      UPSTASH_REDIS_REST_TOKEN: string
    }
  }
}
