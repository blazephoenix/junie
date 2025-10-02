"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import {
  IconArrowRight,
  IconBrain,
  IconCode,
  IconFileText,
  IconFolders,
  IconLock,
  IconPhoto,
  IconTools,
  IconUsers,
  IconWorld,
  IconMoon,
  IconBolt,
  IconCurrencyDollar,
  IconPalette,
  IconDatabase,
  IconServer
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { FC } from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card flex flex-col items-start rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
      <div className="bg-primary/10 mb-4 rounded-lg p-3">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

interface UseCaseCardProps {
  title: string
  items: string[]
}

const UseCaseCard: FC<UseCaseCardProps> = ({ title, items }) => {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2 mt-1">•</span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HomePage() {
  const { theme } = useTheme()

  return (
    <div className="flex size-full flex-col overflow-y-auto">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="mb-8">
          <ChatbotUISVG
            theme={theme === "dark" ? "dark" : "light"}
            scale={0.3}
          />
        </div>

        <h1 className="mb-4 text-center text-5xl font-bold md:text-6xl">
          Your Personal AI Assistant
        </h1>

        <p className="text-muted-foreground mb-8 max-w-2xl text-center text-lg md:text-xl">
          Meet Junie—the open-source AI chat application that adapts to your
          workflow. Multi-model support, intelligent file processing, and
          powerful workspaces, all in one beautiful interface.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center rounded-md px-8 py-3 font-semibold transition-colors"
            href="/login"
          >
            Get Started Free
            <IconArrowRight className="ml-2" size={20} />
          </Link>
          <Link
            className="bg-background hover:bg-accent flex items-center justify-center rounded-md border px-8 py-3 font-semibold transition-colors"
            href="https://github.com"
            target="_blank"
          >
            View on GitHub
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Everything you need in an AI assistant
          </h2>
          <p className="text-muted-foreground mb-12 text-center text-lg">
            Powerful features that adapt to your workflow
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<IconBrain className="text-primary" size={32} />}
              title="Multi-LLM Freedom"
              description="Choose from 8+ AI providers including OpenAI, Anthropic, Google, Azure, Mistral, Groq, OpenRouter, and Ollama. Switch between models seamlessly or run local AI with complete privacy."
            />
            <FeatureCard
              icon={<IconFileText className="text-primary" size={32} />}
              title="Intelligent File Processing"
              description="Drop in PDFs, DOCX, TXT, CSV, JSON, and &#39;Markdown files. Junie understands your documents and can answer questions, summarize content, and extract insights instantly."
            />
            <FeatureCard
              icon={<IconPhoto className="text-primary" size={32} />}
              title="Vision-Powered Analysis"
              description="Attach images and let vision models analyze, describe, and answer questions about your visual content. Perfect for diagrams, screenshots, and photos."
            />
            <FeatureCard
              icon={<IconFolders className="text-primary" size={32} />}
              title="Organized Workspaces"
              description="Keep your conversations, files, and assistants organized in dedicated workspaces. Separate personal, work, and project contexts effortlessly."
            />
            <FeatureCard
              icon={<IconTools className="text-primary" size={32} />}
              title="Extensible Tools"
              description="Build custom tools and integrations that extend Junie&#39;s capabilities. From web searches to API calls, make your AI assistant truly yours."
            />
            <FeatureCard
              icon={<IconUsers className="text-primary" size={32} />}
              title="Pre-configured Assistants"
              description="Save time with pre-built AI assistants tailored for specific tasks. Create your own specialized assistants with custom instructions and tools."
            />
            <FeatureCard
              icon={<IconWorld className="text-primary" size={32} />}
              title="Speaks Your Language"
              description="Full internationalization support means Junie works in your preferred language, wherever you are."
            />
            <FeatureCard
              icon={<IconMoon className="text-primary" size={32} />}
              title="Beautiful Dark Mode"
              description="A modern, carefully crafted interface that&#39;s easy on the eyes. Toggle between light and dark themes to match your preference."
            />
          </div>
        </div>
      </section>

      {/* Why Junie Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Why developers and teams choose Junie
          </h2>
          <p className="text-muted-foreground mb-12 text-center text-lg">
            Built for privacy, control, and performance
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 mb-4 rounded-full p-4">
                <IconLock className="text-primary" size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Privacy First</h3>
              <p className="text-muted-foreground">
                Self-host on your infrastructure. Your data stays yours. Use
                local AI models for complete offline operation.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 mb-4 rounded-full p-4">
                <IconCurrencyDollar className="text-primary" size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Cost Control</h3>
              <p className="text-muted-foreground">
                Bring your own API keys or use local models. No monthly
                subscriptions, no per-seat pricing. You&#39;re in control.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 mb-4 rounded-full p-4">
                <IconBolt className="text-primary" size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Built for Speed</h3>
              <p className="text-muted-foreground">
                Modern Next.js 14 architecture with React Server Components.
                Fast page loads, instant responses, and smooth interactions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 mb-4 rounded-full p-4">
                <IconPalette className="text-primary" size={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fully Customizable</h3>
              <p className="text-muted-foreground">
                Open-source MIT license means you can modify, extend, and brand
                Junie however you need. It&#39;s your assistant, your way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Built with modern, reliable technology
          </h2>
          <p className="text-muted-foreground mb-12 text-center text-lg">
            Standing on the shoulders of giants
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card flex items-center rounded-lg border p-4">
              <IconServer className="text-primary mr-3" size={24} />
              <div>
                <h3 className="font-semibold">Next.js 14</h3>
                <p className="text-muted-foreground text-sm">App Router</p>
              </div>
            </div>
            <div className="bg-card flex items-center rounded-lg border p-4">
              <IconCode className="text-primary mr-3" size={24} />
              <div>
                <h3 className="font-semibold">TypeScript</h3>
                <p className="text-muted-foreground text-sm">Type-safe</p>
              </div>
            </div>
            <div className="bg-card flex items-center rounded-lg border p-4">
              <IconDatabase className="text-primary mr-3" size={24} />
              <div>
                <h3 className="font-semibold">Supabase</h3>
                <p className="text-muted-foreground text-sm">PostgreSQL</p>
              </div>
            </div>
            <div className="bg-card flex items-center rounded-lg border p-4">
              <IconPalette className="text-primary mr-3" size={24} />
              <div>
                <h3 className="font-semibold">Tailwind CSS</h3>
                <p className="text-muted-foreground text-sm">
                  Responsive design
                </p>
              </div>
            </div>
            <div className="bg-card flex items-center rounded-lg border p-4">
              <IconBrain className="text-primary mr-3" size={24} />
              <div>
                <h3 className="font-semibold">Vercel AI SDK</h3>
                <p className="text-muted-foreground text-sm">LLM integration</p>
              </div>
            </div>
            <div className="bg-card flex items-center rounded-lg border p-4">
              <IconLock className="text-primary mr-3" size={24} />
              <div>
                <h3 className="font-semibold">Supabase Auth</h3>
                <p className="text-muted-foreground text-sm">Secure login</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Perfect for every workflow
          </h2>
          <p className="text-muted-foreground mb-12 text-center text-lg">
            From developers to researchers to everyone in between
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <UseCaseCard
              title="For Developers"
              items={[
                "Debug code with AI assistance",
                "Process documentation and API specs",
                "Review pull requests intelligently",
                "Local development with Ollama"
              ]}
            />
            <UseCaseCard
              title="For Teams"
              items={[
                "Collaborative workspaces",
                "Shared assistants and tools",
                "Document analysis and insights",
                "Custom integrations"
              ]}
            />
            <UseCaseCard
              title="For Researchers"
              items={[
                "Analyze research papers",
                "Extract data from documents",
                "Multi-model comparison",
                "Privacy-focused processing"
              ]}
            />
            <UseCaseCard
              title="For Everyone"
              items={[
                "Personal knowledge assistant",
                "File organization and search",
                "Multi-language support",
                "Fully customizable experience"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Get Junie running in minutes
          </h2>
          <p className="text-muted-foreground mb-12 text-center text-lg">
            Simple setup, powerful results
          </p>

          <div className="bg-card overflow-hidden rounded-lg border">
            <div className="bg-muted px-4 py-2">
              <span className="font-mono text-sm">bash</span>
            </div>
            <pre className="overflow-x-auto p-4">
              <code className="text-sm">
                {`# Clone the repository
git clone <your-repo-url>
cd junie

# Install dependencies
npm install

# Start Supabase locally
supabase start

# Launch Junie
npm run chat`}
              </code>
            </pre>
          </div>

          <p className="text-muted-foreground mt-6 text-center">
            That&#39;s it! Junie will be running at{" "}
            <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
              localhost:3000
            </code>
          </p>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Open source and community driven
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Junie is MIT licensed and built on the foundation of{" "}
            <Link
              href="https://github.com/mckaywrigley/chatbot-ui"
              className="text-primary hover:underline"
              target="_blank"
            >
              Chatbot UI
            </Link>{" "}
            by McKay Wrigley. Join our community, contribute improvements, and
            help shape the future of open-source AI assistants.
          </p>
          <Link
            className="bg-background hover:bg-accent inline-flex items-center justify-center rounded-md border px-8 py-3 font-semibold transition-colors"
            href="https://github.com"
            target="_blank"
          >
            Star us on GitHub
            <IconArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary text-primary-foreground px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to meet your new AI assistant?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Deploy Junie in minutes and experience the freedom of open-source
            AI.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              className="bg-background text-foreground hover:bg-background/90 flex items-center justify-center rounded-md px-8 py-3 font-semibold transition-colors"
              href="/login"
            >
              Get Started Free
              <IconArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              className="border-primary-foreground hover:bg-primary-foreground/10 flex items-center justify-center rounded-md border bg-transparent px-8 py-3 font-semibold transition-colors"
              href="https://github.com"
              target="_blank"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="text-muted-foreground mx-auto max-w-7xl text-center text-sm">
          <p>Junie - Your personal AI assistant, your way.</p>
          <p className="mt-2">MIT Licensed • Open Source</p>
        </div>
      </footer>
    </div>
  )
}
