export interface NavbarItem {
    class : string;
    pathTo : string;
    text : string;
    dropdownItems? : NavbarItem[];
}


export const NavbarItems : NavbarItem[] = [
    {
        class: 'nav-button',
        pathTo: `/`,
        text: 'Home',
    },
    {
        class: 'nav-button',
        pathTo: '/rankings',
        text: 'Rankings',
    },
    {
        class: 'nav-button',
        pathTo: '/schedule',
        text: 'Schedule',
    },
    {
        class: 'nav-button',
        pathTo: '/brawl',
        text: 'Brawlhalla',
    },
    {
        class: 'nav-button',
        pathTo: '/league',
        text: 'League of Legends',
    },
    {
        class: 'nav-button',
        pathTo: '/blast',
        text: 'Bull**** Blast',
        dropdownItems: [
            {
                class: 'nav-drop-button',
                pathTo: '/blast/jeopardy',
                text: 'Jeopardy',
            },
            {
                class: 'nav-drop-button',
                pathTo: '/blast/amongus',
                text: 'Among Us',
            },
        ]
    }
]

export const LogItems : NavbarItem[] = [
    {
        class: 'nav-button',
        pathTo: '/login',
        text: 'Login'
    },
    {
        class: 'nav-button',
        pathTo: '/logout',
        text: 'Logout'
    }
]

export const AccountItems : NavbarItem[] = [
    {
        class: 'nav-button',
        pathTo: '/account',
        text: 'Account'
    }
]