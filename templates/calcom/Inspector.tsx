'use client'
import { Input } from '@/components/shadcn/Input'
import { useFrameConfig, useFrameId } from '@/sdk/hooks'
import { use, useRef } from 'react'
import type { Config } from '.'
import { ColorPicker, FontFamilyPicker, FontStylePicker, FontWeightPicker } from '@/sdk/components'
import { uploadImage } from '@/sdk/upload'
import { ToggleGroup } from '@/components/shadcn/ToggleGroup'
import { ToggleGroupItem } from '@/components/shadcn/ToggleGroup'
import { getName } from './utils/metadata'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/Select'
import { Switch } from '@/components/shadcn/Switch'
import { useSession } from 'next-auth/react'

export default function Inspector() {
    const frameId = useFrameId()
    const sesh = useSession()
    const [config, updateConfig] = useFrameConfig<Config>()

    const displayLabelInputRef = useRef<HTMLInputElement>(null)
    const displayLabelDaysRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (username: string) => {
        updateConfig({
            username: username,

            fid: sesh.data?.user?.id,
        })
    }

    const handleNFT = async (nftAddress: string) => {
        const nftName = await getName(nftAddress, config.nftOptions.nftChain)
        updateConfig({
            nftOptions: {
                ...config.nftOptions,
                nftAddress: nftAddress,
                nftName: nftName,
            },
        })
    }
    const handleChainChange = (value: any) => {
        console.log(value)
        updateConfig({
            nftOptions: {
                ...config.nftOptions,
                nftChain: value,
            },
        })
    }
    const handleNftTypeChange = (value: any) => {
        console.log(value)
        updateConfig({
            nftOptions: {
                ...config.nftOptions,
                nftType: value,
            },
        })
    }
    const handleTokenIdChange = async (e: any) => {
        updateConfig({
            nftOptions: {
                ...config.nftOptions,
                tokenId: e.target.value,
            },
        })
    }

    return (
        <div className="w-full h-full space-y-4">
            <p>{JSON.stringify(config)}</p>

            <h3 className="text-lg font-semibold">Enter your Cal username</h3>

            <div className="flex flex-col gap-2 ">
                <Input
                    className="text-lg"
                    placeholder="Enter your cal.com username"
                    ref={displayLabelInputRef}
                    onChange={() => {
                        handleSubmit(displayLabelInputRef.current!.value)
                    }}
                />
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <h2 className="text-lg">Karma gating</h2>
                    <span className="text-sm">
                        (Enables only your second degree connections book call with you)
                    </span>
                    <ToggleGroup type="single" className="flex justify-start gap-2">
                        <ToggleGroupItem
                            value="true"
                            className="border-2 border-zinc-600"
                            onClick={() => {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        karmaGating: true,
                                    },
                                })
                            }}
                        >
                            Enabled
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="false"
                            className="border-2 border-zinc-600"
                            onClick={() => {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        karmaGating: false,
                                    },
                                })
                            }}
                        >
                            Disabled
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <h2 className="text-lg">Nft Gating</h2>
                    <span className="text-sm">
                        (allow specific user holding NFT to book a call with you)
                    </span>
                    <ToggleGroup type="single" className="flex justify-start gap-2">
                        <ToggleGroupItem
                            value="true"
                            className="border-2 border-zinc-600"
                            onClick={() => {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        nftGating: true,
                                    },
                                })
                            }}
                        >
                            Enabled
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="false"
                            className="border-2 border-zinc-600"
                            onClick={() => {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        nftGating: false,
                                    },
                                })
                            }}
                        >
                            Disabled
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                {config.gatingOptions.nftGating && (
                    <div className="flex-col gap-2">
                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="text-lg">Choose Chain</h2>
                            <Select onValueChange={handleChainChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Chain" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ETH">ETH</SelectItem>
                                    <SelectItem value="BASE">BASE</SelectItem>
                                    <SelectItem value="OP">OP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="text-lg">Choose NFT Type</h2>
                            <Select
                                // defaultValue={config.nftOptions.nftType}
                                onValueChange={handleNftTypeChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select NFT type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ERC721">ERC721</SelectItem>
                                    <SelectItem value="ERC1155">ERC1155</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="text-lg">NFT address</h2>
                            <Input
                                className="text-lg"
                                placeholder="Enter your NFT address"
                                onChange={async (e) => {
                                    await handleNFT(e.target.value)
                                }}
                            />
                        </div>
                        {config.nftOptions.nftType === 'ERC1155' && (
                            <div className="flex flex-col gap-2 w-full">
                                <h2 className="text-lg">Token ID</h2>
                                <Input
                                    className="text-lg"
                                    placeholder="Enter your NFT token ID"
                                    onChange={handleTokenIdChange}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                        <h2 className="text-lg">Recasted</h2>
                        <span className="text-sm">
                            (only users who recasted your cast can book a call)
                        </span>
                    </div>
                    <Switch
                        checked={config.gatingOptions.recasted}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        recasted: true,
                                    },
                                })
                            } else {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        recasted: false,
                                    },
                                })
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                        <h2 className="text-lg">Liked</h2>
                        <span className="text-sm">
                            (only users who liked your cast can book a call)
                        </span>
                    </div>
                    <Switch
                        checked={config.gatingOptions.liked}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        liked: true,
                                    },
                                })
                            } else {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        liked: false,
                                    },
                                })
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                        <h2 className="text-lg">Follower</h2>
                        <span className="text-sm">(only users who you follow can book a call)</span>
                    </div>
                    <Switch
                        checked={config.gatingOptions.follower}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        follower: true,
                                    },
                                })
                            } else {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        follower: false,
                                    },
                                })
                            }
                        }}
                    />
                </div>{' '}
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center">
                        <h2 className="text-lg">Liked</h2>
                        <span className="text-sm">(only users who follow you can book a call)</span>
                    </div>
                    <Switch
                        checked={config.gatingOptions.following}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        following: true,
                                    },
                                })
                            } else {
                                updateConfig({
                                    gatingOptions: {
                                        ...config.gatingOptions,
                                        following: false,
                                    },
                                })
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg">Font</h2>
                    <FontFamilyPicker
                        onSelect={(font) => {
                            updateConfig({
                                fontFamily: font,
                            })
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg">Primary Color</h2>
                    <ColorPicker
                        className="w-full"
                        background={config.primaryColor || '#ffffff'}
                        setBackground={(value: string) =>
                            updateConfig({
                                primaryColor: value,
                            })
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg">Secondary Color</h2>
                    <ColorPicker
                        className="w-full"
                        background={config.secondaryColor || '#000000'}
                        setBackground={(value: string) =>
                            updateConfig({
                                secondaryColor: value,
                            })
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg">Title Style</h2>
                    <FontStylePicker
                        currentFont={config?.title?.fontFamily || 'Roboto'}
                        defaultValue={config?.title?.fontStyle || 'normal'}
                        onSelect={(style) =>
                            updateConfig({
                                titleStyle: style,
                            })
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg">Title Weight</h2>
                    <FontWeightPicker
                        currentFont={config.fontFamily || 'Roboto'}
                        defaultValue={config.fontFamily}
                        onSelect={(weight) =>
                            updateConfig({
                                titleWeight: weight,
                            })
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg">Background</h2>
                    <ColorPicker
                        className="w-full"
                        enabledPickers={['solid', 'gradient', 'image']}
                        background={config.background || '#000000'}
                        setBackground={(e) =>
                            updateConfig({
                                background: e,
                            })
                        }
                        uploadBackground={async (base64String, contentType) => {
                            const { filePath } = await uploadImage({
                                frameId: frameId,
                                base64String: base64String,
                                contentType: contentType,
                            })

                            return filePath
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
