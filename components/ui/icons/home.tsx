const Home = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...rest}
        >
            <path
                d="M18.3334 8.75L10.7359 2.35167C10.5301 2.17831 10.2696 2.08325 10.0005 2.08325C9.73138 2.08325 9.47092 2.17831 9.26508 2.35167L1.66675 8.75"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17.0834 4.16667V12.9167C17.0834 15.2733 17.0834 16.4525 16.3509 17.1842C15.6192 17.9167 14.4401 17.9167 12.0834 17.9167H7.91675C5.56008 17.9167 4.38091 17.9167 3.64925 17.1842C2.91675 16.4525 2.91675 15.2733 2.91675 12.9167V7.91667"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.75008 9.58333H7.91675V10.4167H8.75008V9.58333ZM12.0834 9.58333H11.2501V10.4167H12.0834V9.58333ZM8.75008 12.9167H7.91675V13.75H8.75008V12.9167ZM12.0834 12.9167H11.2501V13.75H12.0834V12.9167Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Home;
