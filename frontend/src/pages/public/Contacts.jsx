import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import {
	Bars3Icon,
	ChatBubbleLeftRightIcon,
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import bankLogo from '../../assets/bank-icon.png'

const navigation = [
	{ name: 'Accueil', href: '/' },
	{ name: 'Fonctionnalités', href: '/features' },
	{ name: 'Contacts', href: '/contacts' },
]

const contactsContent = {
	brandName: 'Bank Manager',
	menu: {
		openLabel: 'Open main menu',
		closeLabel: 'Close menu',
		loginLabel: 'Se connecter',
	},
	hero: {
		eyebrow: 'Contacts',
		title: 'Une question sur votre espace financier ?',
		description:
			"Notre équipe vous répond rapidement pour vous accompagner sur l'application, votre compte ou vos données.",
	},
	cta: {
		primary: 'Créer un compte',
		secondary: 'Voir les fonctionnalités',
	},
}

const contactCards = [
	{
		name: 'Email support',
		value: 'support@bankmanager.app',
		href: 'mailto:support@bankmanager.app',
		description: 'Réponse sous 24h ouvrées',
		icon: EnvelopeIcon,
	},
	{
		name: 'Téléphone',
		value: '+33 1 84 00 00 00',
		href: 'tel:+33184000000',
		description: 'Lun - Ven, 9h à 18h',
		icon: PhoneIcon,
	},
	{
		name: 'Chat produit',
		value: 'Bientôt disponible dans le dashboard',
		// href: '/login',
		description: 'Pour les utilisateurs connectés',
		icon: ChatBubbleLeftRightIcon,
	},
	{
		name: 'Adresse',
		value: 'Le Mans, France',
		href: 'https://maps.google.com/?q=Paris',
		description: 'Équipe distribuée, support centralisé',
		icon: MapPinIcon,
	},
]

export default function Contacts() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<div className="bg-white min-h-screen overflow-x-hidden">
			<header className="absolute inset-x-0 top-0 z-50">
				<nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
					<div className="flex lg:flex-1">
						<a href="/" className="-m-1.5 p-1.5">
							<span className="sr-only">{contactsContent.brandName}</span>
							<img alt="Bank Manager Logo" src={bankLogo} className="h-8 w-auto" />
						</a>
					</div>

					<div className="flex lg:hidden">
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
						>
							<span className="sr-only">{contactsContent.menu.openLabel}</span>
							<Bars3Icon aria-hidden="true" className="size-6" />
						</button>
					</div>

					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="text-sm/6 font-semibold text-gray-900"
							>
								{item.name}
							</a>
						))}
					</div>

					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<a href="/login" className="text-sm/6 font-semibold text-gray-900">
							{contactsContent.menu.loginLabel} <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>

				<Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
					<div className="fixed inset-0 z-50" />
					<DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<a href="/" className="-m-1.5 p-1.5">
								<span className="sr-only">{contactsContent.brandName}</span>
								<img alt="Bank Manager Logo" src={bankLogo} className="h-8 w-auto" />
							</a>
							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
							>
								<span className="sr-only">{contactsContent.menu.closeLabel}</span>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-gray-500/10">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
										>
											{item.name}
										</a>
									))}
								</div>
								<div className="py-6">
									<a
										href="/login"
										className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
									>
										{contactsContent.menu.loginLabel}
									</a>
								</div>
							</div>
						</div>
					</DialogPanel>
				</Dialog>
			</header>

			<main className="relative isolate overflow-hidden px-6 pt-14 lg:px-8">
				<div
					aria-hidden="true"
					className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
					/>
				</div>

				<div className="mx-auto max-w-2xl py-24 sm:py-36 lg:py-40 text-center">
					<p className="text-base font-semibold text-indigo-600">{contactsContent.hero.eyebrow}</p>
					<h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
						{contactsContent.hero.title}
					</h1>
					<p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
						{contactsContent.hero.description}
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<a
							href="/register"
							className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							{contactsContent.cta.primary}
						</a>
						<a href="/features" className="text-sm/6 font-semibold text-gray-900">
							{contactsContent.cta.secondary} <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</div>

				<div className="mx-auto max-w-5xl pb-24 sm:pb-32">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{contactCards.map((contact) => (
							<article
								key={contact.name}
								className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm ring-1 ring-gray-900/5 backdrop-blur"
							>
								<contact.icon className="h-7 w-7 text-indigo-600" aria-hidden="true" />
								<h2 className="mt-4 text-lg font-semibold text-gray-900">{contact.name}</h2>
								<p className="mt-2 text-sm leading-6 text-gray-600">{contact.description}</p>
								<a href={contact.href} className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
									{contact.value}
								</a>
							</article>
						))}
					</div>
				</div>

				<div
					aria-hidden="true"
					className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
					/>
				</div>
			</main>
		</div>
	)
}
