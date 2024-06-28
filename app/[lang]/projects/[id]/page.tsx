import { Metadata, ResolvingMetadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/data/projects"
import GithubVector from "@/public/social-medias/github-fill.svg"
import GlobalVector from "@/public/social-medias/global-line.svg"
import TwitterVector from "@/public/social-medias/twitter-fill.svg"

import { ProjectInterface } from "@/lib/types"
import { Markdown } from "@/components/ui/markdown"
import { Divider } from "@/components/divider"
import { Icons } from "@/components/icons"
import DiscoverMoreProjects from "@/components/project/discover-more-projects"
import { ProjectTags } from "@/components/project/project-detail-tags"
import ProjectExtraLinks from "@/components/project/project-extra-links"
import { useTranslation } from "@/app/i18n"
import { LocaleTypes } from "@/app/i18n/settings"

type PageProps = {
  params: { id: string; lang: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface ProjectProps {
  project: ProjectInterface
  lang: LocaleTypes
}

declare const window: any
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const currProject = projects.filter(
    (project) => String(project.id) === params.id
  )[0]

  const isProduction = process.env.NODE_ENV === "production"

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://pse.dev"
      : typeof window !== "undefined"
      ? window?.location?.origin
      : ""

  const hasProjectImage = currProject?.image?.length > 0

  const productionImage: string = isProduction
    ? new URL(
        hasProjectImage
          ? `/project-banners/${currProject.image}`
          : `/og-image.png`,
        BASE_URL
      ).toString()
    : ""

  const devImage: string = !isProduction
    ? hasProjectImage
      ? `/project-banners/${currProject.image}`
      : "./og-image.png"
    : "./og-image.png"

  return {
    title: currProject.name,
    description: currProject.tldr,
    openGraph: {
      url: BASE_URL,
      images: [
        {
          url: isProduction ? productionImage : devImage,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const currProject = projects.filter(
    (project) => String(project.id) === params.id
  )[0]
  const lang = params?.lang as LocaleTypes
  const { t } = await useTranslation(lang, "common")

  const { github, twitter, website } = currProject.links ?? {}
  const hasSocialLinks = Object.keys(currProject?.links ?? {}).length > 0

  return (
    <section className="bg-project-page-gradient">
      <Divider.Section className="flex flex-col items-center">
        <div className="flex w-full flex-col items-center justify-center gap-5 px-6 py-8 md:px-0 md:py-16">
          <div className=" w-full md:max-w-[644px]">
            <div className="flex flex-col">
              <div className="flex flex-col gap-6 text-left">
                <Link
                  className="flex items-center gap-2 text-tuatara-950/80 hover:text-tuatara-950"
                  href={`/${lang}/projects`}
                >
                  <Icons.arrowLeft />
                  <span className="font-sans text-base">
                    {t("projectLibrary")}
                  </span>
                </Link>
                <div className="flex flex-col gap-2">
                  <h1 className="py-2 text-3xl font-bold leading-[110%] md:text-5xl">
                    {currProject.name}
                  </h1>
                  <p className="py-2 leading-[150%] text-slate-600">
                    {currProject.tldr}
                  </p>
                </div>
              </div>
              {hasSocialLinks && (
                <div className="flex flex-wrap items-center justify-start gap-6 pt-4">
                  {github && (
                    <Link href={github} target="_blank" rel="noreferrer">
                      <div className="flex items-center gap-2">
                        <Image
                          src={GithubVector}
                          alt=""
                          width={16}
                          height={16}
                        />
                        <p className="text-slate-600">Github</p>
                      </div>
                    </Link>
                  )}
                  {website && (
                    <Link href={website} target="_blank" rel="noreferrer">
                      <div className="flex items-center gap-2">
                        <Image
                          src={GlobalVector}
                          alt=""
                          width={16}
                          height={16}
                        />
                        <p className="text-slate-600">Website</p>
                      </div>
                    </Link>
                  )}
                  {twitter && (
                    <Link href={twitter} target="_blank" rel="noreferrer">
                      <div className="flex items-center gap-2">
                        <Image
                          src={TwitterVector}
                          alt=""
                          width={16}
                          height={16}
                        />
                        <p className="text-slate-600">Twitter</p>
                      </div>
                    </Link>
                  )}
                </div>
              )}
              <div className="mt-10 hidden h-[1px] w-full bg-anakiwa-300 md:block"></div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-6 md:mt-[50px]">
              <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src={`/project-banners/${
                    currProject.image ? currProject.image : "fallback.webp"
                  }`}
                  alt={`${currProject.name} banner`}
                  width={1200}
                  height={630}
                  className="w-full rounded-t-lg object-cover"
                />
                {!currProject?.image && (
                  <span className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-5 text-center text-3xl font-bold text-black">
                    {currProject?.imageAlt || currProject?.name}
                  </span>
                )}
              </div>
              <ProjectTags project={currProject} lang={lang} />
              <div className="flex w-full flex-col gap-5 text-base font-normal leading-relaxed">
                <Markdown>{currProject.description}</Markdown>
              </div>
              <ProjectExtraLinks project={currProject} lang={lang} />
            </div>
          </div>
        </div>
        <DiscoverMoreProjects project={currProject} lang={lang} />
      </Divider.Section>
    </section>
  )
}
