'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { User2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

// import ArrowDrop from '../../../public/assets/icons-react/ArrowDrop';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
export type TNavItem = {
  dropdown: boolean;
  title: string;
  href?: string;
  content?: { subTitle: string; href: string; description?: string }[];
};

export type midNavMenu = { midNavMenu?: TNavItem[]; midNavSearch?: boolean };

type TNavMenu = {
  leftNav?: TNavItem[];
  midNav?: midNavMenu;
  rightNav?: TNavItem[];
  additionalElement?: ReactNode;
  loginButton?: boolean;
};

const NextLink = ({ href, ...props }: { children: ReactNode; href: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link className="" href={href} passHref legacyBehavior>
      <NavigationMenuLink
        className={(navigationMenuTriggerStyle(), '  NavigationMenuLink block  p-1')}
        active={isActive}
        {...props}
      />
    </Link>
  );
};

const NavItem = ({ item }: { item: TNavItem }): ReactNode => {
  return (
    <NavigationMenuItem className="relative z-50 size-full overflow-hidden rounded-lg  border-transparent py-2 group-hover:border-slate-700 dark:border-white/[0.2]">
      {item.dropdown ? (
        <>
          <NavigationMenuTrigger className="p-1 ">{item.title}</NavigationMenuTrigger>

          <NavigationMenuContent className="text-black">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {item.content?.map((item) => (
                <ListItem key={Math.random()} href={item.href} title={item.subTitle}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <NextLink href={item.href || ''}>{item.title}</NextLink>
      )}
    </NavigationMenuItem>
  );
};
function ReNav({ leftNav, midNav, rightNav, additionalElement, loginButton = true }: TNavMenu) {
  const [activeScroll, setActiveScroll] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 630) {
        setTimeout(() => {
          setShowInput(true);
        }, 30);
      } else {
        setShowInput(false);
      }
      if (scrollY > 50) {
        setTimeout(() => {
          setActiveScroll(true);
        }, 100);
      } else {
        setTimeout(() => {
          setActiveScroll(false);
        }, 100);
      }
    };

    // Check the initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        'shadow-custom sticky top-0 !z-50 mx-auto !border-transparent bg-primary-100/30 font-semibold text-primary-500 dark:bg-dark-100 dark:text-light-300 transition-colors transform duration-500',
        { 'bg-primary-400 text-light-100': activeScroll }
      )}
    >
      <div className="container">
        <div className="relative mx-auto hidden items-center justify-between bg-transparent  lg:flex ">
          {/* nav item left */}
          <div className="flex-center">
            <Link
              className={cn('hidden', {
                'lg:block': activeScroll,
                hidden: !activeScroll,
              })}
              href="/"
            >
              <Image
                className=""
                src="/assets/images/logo-white-transparent.png"
                height={70}
                width={70}
                alt=""
              />
            </Link>

            <div className="flex  flex-col py-2">
              {leftNav && leftNav.length > 0 && (
                <NavigationMenu>
                  <NavigationMenuList>
                    {leftNav.map((item, i) => (
                      <span
                        key={item.title}
                        className="group relative  block size-full px-2 "
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <AnimatePresence>
                          {hoveredIndex === i && (
                            <>
                              <motion.span
                                // className="bg-primary-200/30  absolute inset-0 block size-full rounded-lg dark:bg-slate-800/[0.8] "
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: 1,
                                  transition: { duration: 0.15 },
                                }}
                                exit={{
                                  opacity: 0,
                                  transition: { duration: 0.15, delay: 0.3 },
                                }}
                              />

                              {item.dropdown && (
                                <motion.div
                                  // className="absolute left-1/2 top-[68%] -translate-x-1/2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1, transition: { duration: 0 } }}
                                  exit={{ opacity: 0, transition: { duration: 0, delay: 0 } }}
                                >
                                  {/* <ArrowDrop /> */}
                                </motion.div>
                              )}
                            </>
                          )}
                        </AnimatePresence>
                        <NavItem item={item} />
                      </span>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* nav item mid */}
          <div>
            {/*  */}
            <>
              {midNav && midNav.midNavMenu && midNav.midNavMenu.length > 0 && (
                <NavigationMenu>
                  <NavigationMenuList>
                    {midNav.midNavMenu.map((item, i) => (
                      <span
                        key={item.title}
                        className="group relative  block size-full px-2 "
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <AnimatePresence>
                          {hoveredIndex === i && (
                            <>
                              <motion.span
                                // className="bg-primary-200/30  absolute inset-0 block size-full rounded-lg dark:bg-slate-800/[0.8] "
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: 1,
                                  transition: { duration: 0.15 },
                                }}
                                exit={{
                                  opacity: 0,
                                  transition: { duration: 0.15, delay: 0.3 },
                                }}
                              />

                              {item.dropdown && (
                                <motion.div
                                  // className="absolute left-1/2 top-[68%] -translate-x-1/2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1, transition: { duration: 0 } }}
                                  exit={{ opacity: 0, transition: { duration: 0, delay: 0 } }}
                                >
                                  {/* <ArrowDrop /> */}
                                </motion.div>
                              )}
                            </>
                          )}
                        </AnimatePresence>
                        <NavItem item={item} />
                      </span>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
              {midNav && midNav.midNavSearch && (
                <input
                  type="text"
                  className={cn('hidden', {
                    'lg:block': showInput,
                  })}
                />
              )}
            </>
          </div>

          {/* nav item right */}
          <div className="flex-center">
            {rightNav && rightNav.length > 0 && (
              <NavigationMenu>
                <NavigationMenuList>
                  {rightNav.map((item, i) => (
                    <span
                      key={item.title}
                      className="group relative  block size-full px-2 "
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <AnimatePresence>
                        {hoveredIndex === i && (
                          <>
                            <motion.span
                              // className="bg-primary-200/30  absolute inset-0 block size-full rounded-lg dark:bg-slate-800/[0.8] "
                              layoutId="hoverBackground"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.15 },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15, delay: 0.3 },
                              }}
                            />

                            {item.dropdown && (
                              <motion.div
                                // className="absolute left-1/2 top-[68%] -translate-x-1/2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0 } }}
                                exit={{ opacity: 0, transition: { duration: 0, delay: 0 } }}
                              >
                                {/* <ArrowDrop /> */}
                              </motion.div>
                            )}
                          </>
                        )}
                      </AnimatePresence>
                      <NavItem item={item} />
                    </span>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
            {loginButton ? <Link href={'/sign-in'}>login</Link> : <User2Icon className="size-5" />}
            {additionalElement}
            {/* {!loginButton && <User2Icon className="h-6 w-6" />} */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ReNav;
