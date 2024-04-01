import { useTranslations } from 'next-intl'
import React from 'react'

import { BlogPosts } from '~/app/[locale]/(main)/blog/BlogPosts'
import { Headline } from '~/app/[locale]/(main)/Headline'
import { PencilSwooshIcon } from '~/assets'
import { Container } from '~/components/ui/Container'
import { getSettings } from '~/sanity/queries'

import { Photos } from './Photos'

export default async function BlogHomePage() {
  const settings = await getSettings()
  const t = useTranslations('Blog')
  return (
    <>
      <Container className="mt-10">
        <Headline />
      </Container>

      {settings.heroPhotos && <Photos photos={settings.heroPhotos} />}

      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-6 pt-6">
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <PencilSwooshIcon className="h-5 w-5 flex-none" />
              <span className="ml-2">{t('recent posts')}</span>
            </h2>
            <BlogPosts />
          </div>
          {/* <aside className="space-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20">
            <Newsletter />
            <Resume />
          </aside> */}
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60
