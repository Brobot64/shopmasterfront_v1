import ProfileDropdown from "@/components/custom/dashboard/ProfileDropDown";
import React from "react";

const Header = () => {
	return (
		<React.Fragment>
			<header className="w-full flex justify-center mb-[20px]">
                <div className="inners-nav w-full box-border mx-[30px] my-[10px] glass flex flex-row items-center justify-between px-[20px] py-[12px rounded-full shadow-lg">
                    <div className="searchArea">
                        search
                    </div>
                    <ProfileDropdown/>
                </div>
            </header>
		</React.Fragment>
	);
};

export default Header;
