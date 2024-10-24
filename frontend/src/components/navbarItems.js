export const NavItems = [
    {
        class: 'nav-button',
        path: `/`,
        text: 'Home',
        dropdown: false,
        dropItems: []
    },
    {
        class: 'nav-button',
        path: '/score',
        text: 'Score',
        dropdown: false,
        dropItems: []
    },
    {
        class: 'nav-button',
        path: '/schedule',
        text: 'Schedule',
        dropdown: false,
        dropItems: []
    },
    {
        class: 'nav-button',
        path: '/brawl',
        text: 'Brawlhalla',
        dropdown: false,
        dropItems: []
    },
    {
        class: 'nav-button',
        path: '/league',
        text: 'League of Legends',
        dropdown: false,
        dropItems: []
    },
    {
        class: 'nav-button',
        path: '/blast',
        text: 'Bull**** Blast',
        dropdown: true,
        dropItems: [
            {
                class: 'nav-drop-button',
                path: '/blast/jeopardy',
                text: 'Jeopardy',
            },
            {
                class: 'nav-drop-button',
                path: '/blast/amongus',
                text: 'Among Us',
            },
        ]
    }
]

export const LogItems = [
    {
        class: 'nav-button',
        path: '/login',
        text: 'Login'
    },
    {
        class: 'nav-button',
        path: '/logout',
        text: 'Logout'
    }
]

export const AccountItems = [
    {
        class: 'nav-button',
        path: '/account',
        text: 'Account'
    }
]