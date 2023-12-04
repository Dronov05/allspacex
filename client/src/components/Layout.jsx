import {NavLink, Outlet} from "react-router-dom";
import Menu from "./Menu";

export default function Layout({server_host}) {
    return (
        <>
            <header>
                <Menu server_host={server_host} />
            </header>

            <main className={'container'}>
                <Outlet />
            </main>
        </>

    )
}