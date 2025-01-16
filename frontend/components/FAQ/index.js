export default function FaqComponent() {

    const faq = [
        { id: 1, question: 'What is My Afro Scholars App about?', answer: 'My Afro Scholars App is an application that uses technology to connect students across Africa to educational funding from philanthropists in Urban Africa and the global north (developed countries)' },
        { id: 2, question: 'Is my Afro Scholar Legit?', answer: 'Yes, My Afro Scholars  is legit and verifiable. <br/><br/>The promoters have several years of experience and impact in social work' },
        { id: 3, question: 'Do I pay to become a member?', answer: 'Subscription for Students is FREE.' },
        { id: 4, question: 'What is included in My Afro Scholar Membership?', answer: 'Matching with existing scholarships schemes that fit the profile of members. <br/><br/>More visibility for new scholarship schemes that fit members profile. <br/><br/>Counseling, Mentorships and coaching opportunities.' },
        { id: 5, question: 'How is My Afro Scholars different from other scholarship schemes?', answer: 'In addition to matching students with existing scholarship opportunities, myafroscholars app will drive the establishment of new scholarship schemes by High Networth Individuals, MSMEs and large corporations by making it easier to create, fund and manage them.' },
        { id: 6, question: 'Who is qualified to join My Afro Scholars?', answer: 'Every individual who wants to further their education but cannot do so, due to financial constraints as well as harmful ideologies.' },
        { id: 7, question: 'How can I sponsor a scholarship?', answer: 'You can sponsor a scholarship by signing up using the button Fund a Scholarship' },
        { id: 8, question: 'How can I download the app?', answer: 'To download the app, simply go to your google playstore or appstore and search for My Afro Scholars app then click on download and install.' },
    ]

    return (
        <section id="faq" className="bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-12 lg:pt-28">
            <div className="w-full justify-center items-center mr-auto place-self-center lg:col-span-12">
                <h1 className="text-indigo-950 mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl text-center xl:text-6xl dark:text-white">FAQ</h1>
                <p className="m-6 font-light text-gray-500 md:text-lg text-center lg:text-xl dark:text-gray-400">Frequently Asked Questions</p><br/>
            </div>
        </div>
        <div className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-16">
            <div className="mx-auto grid max-w-screen-xl divide-y divide-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    {
                        faq.map((x) => {
                            return (<div key={x.id} className="py-2">
                            <details className="group">
                                    <summary className="flex text-indigo-900 text-lg cursor-pointer list-none items-center justify-between font-medium">
                                        <span>{x.question}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                            <path d="M6 9l6 6 6-6"></path>
                                        </svg>
                                    </span>
                                </summary>
                                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                                        {x.answer}
                                </p>
                            </details>
                        </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    </section>
    )
}