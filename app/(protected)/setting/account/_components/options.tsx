import { Blocks, MonitorCog, User } from "lucide-react";
import ContentWrapper from "./content-wrapper";
import { useRouter } from "@/components/loader/use-router";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"

const accountOptions = [{ key: "Account", icon: User }];
const preferencesOptions = [{ key: "Preferences", icon: MonitorCog }];
const integrationOptions = [{ key: "Integration", icon: Blocks }];

const NavigateOptions = () => {
    const router = useRouter();
    return (
        <ContentWrapper
            className="p-0 h-full"
        >
            <Command
                className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search setting..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Account">
                        {accountOptions.map((option) => (
                            <CommandItem
                                onSelect={() => router.push(`/setting/${option.key.toLowerCase()}`)}
                                key={option.key}>
                                <option.icon className="mr-2 h-4 w-4" />
                                <span>{option.key}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Preferences">
                        {preferencesOptions.map((option) => (
                            <CommandItem
                                onSelect={() => router.push(`/setting/${option.key.toLowerCase()}`)}
                                key={option.key}>
                                <option.icon className="mr-2 h-4 w-4" />
                                <span>{option.key}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Integration">
                        {integrationOptions.map((option) => (
                            <CommandItem
                                onSelect={() => router.push(`/setting/${option.key.toLowerCase()}`)}
                                key={option.key}>
                                <option.icon className="mr-2 h-4 w-4" />
                                <span>{option.key}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup >
                </CommandList>
            </Command>

        </ContentWrapper>
    )
};

export default NavigateOptions;