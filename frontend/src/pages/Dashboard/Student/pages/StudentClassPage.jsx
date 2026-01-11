import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from '@/components/ui/label'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    MessageSquare,
    Users,
    ScreenShare,
    ScreenShareOff,
    Hand,
    Send,
    MoreVertical,
    Share2,
    Download,
    BookOpen,
    Clock,
    Calendar,
    Pin,
    PinOff,
    Paperclip,
    Smile,
    ThumbsUp,
    Award,
    Zap,
    Volume2,
    VolumeX,
    Airplay,
    Maximize2,
    Minimize2,
    HelpCircle,
    FileText,
    Link,
    Edit,
    CheckCircle2,
    XCircle,
    User,
    BookMarked,
    Bell,
    Settings,
    Upload,
    Eye, // Added the missing import
} from 'lucide-react'

const StudentClassPage = () => {
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isHandRaised, setIsHandRaised] = useState(false)
    const [chatMessage, setChatMessage] = useState('')
    const [activeTab, setActiveTab] = useState('chat')
    const [isRecording, setIsRecording] = useState(false)
    const [volume, setVolume] = useState(80)
    const [isPinned, setIsPinned] = useState(false)

    const videoRef = useRef(null)
    const chatContainerRef = useRef(null)

    // Mock data for participants
    const participants = [
        { id: 1, name: "Prof. Sarah Johnson", role: "teacher", isSpeaking: true, isVideoOn: true, isMuted: false },
        { id: 2, name: "You", role: "student", isSpeaking: false, isVideoOn: true, isMuted: false },
        { id: 3, name: "Alex Chen", role: "student", isSpeaking: false, isVideoOn: true, isMuted: true },
        { id: 4, name: "Maria Rodriguez", role: "student", isSpeaking: true, isVideoOn: false, isMuted: false },
        { id: 5, name: "James Wilson", role: "student", isSpeaking: false, isVideoOn: true, isMuted: false },
        { id: 6, name: "Priya Sharma", role: "student", isSpeaking: false, isVideoOn: false, isMuted: false },
        { id: 7, name: "David Kim", role: "student", isSpeaking: false, isVideoOn: true, isMuted: true },
        { id: 8, name: "Emma Thompson", role: "student", isSpeaking: false, isVideoOn: true, isMuted: false },
    ]

    // Mock chat messages
    const chatMessages = [
        { id: 1, sender: "Prof. Sarah Johnson", message: "Welcome everyone! Today we'll cover React Hooks and Custom Hooks", time: "10:00 AM", role: "teacher", isSystem: false },
        { id: 2, sender: "System", message: "Alex Chen joined the class", time: "10:01 AM", role: "system", isSystem: true },
        { id: 3, sender: "Maria Rodriguez", message: "Good morning Professor!", time: "10:02 AM", role: "student", isSystem: false },
        { id: 4, sender: "James Wilson", message: "I have a question about useEffect dependencies", time: "10:05 AM", role: "student", isSystem: false },
        { id: 5, sender: "Prof. Sarah Johnson", message: "Great question James! Let me explain with an example", time: "10:06 AM", role: "teacher", isSystem: false },
        { id: 6, sender: "You", message: "Can we see some real-world use cases?", time: "10:08 AM", role: "student", isSystem: false },
        { id: 7, sender: "System", message: "David Kim raised their hand", time: "10:10 AM", role: "system", isSystem: true },
        { id: 8, sender: "Prof. Sarah Johnson", message: "Yes, let me share my screen to show you", time: "10:11 AM", role: "teacher", isSystem: false },
    ]

    // Mock class materials
    const materials = [
        { id: 1, name: "React Hooks Guide.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "Prof. Sarah Johnson" },
        { id: 2, name: "Custom Hooks Examples.zip", type: "zip", size: "5.1 MB", uploadedBy: "Prof. Sarah Johnson" },
        { id: 3, name: "Assignment 3 - Hooks Practice", type: "doc", size: "1.2 MB", uploadedBy: "You" },
        { id: 4, name: "Recording - Session 5", type: "video", size: "245 MB", uploadedBy: "System" },
    ]

    // Mock poll
    const poll = {
        question: "How comfortable are you with React Hooks?",
        options: [
            { id: 1, text: "Very comfortable", votes: 8, percentage: 40 },
            { id: 2, text: "Somewhat comfortable", votes: 6, percentage: 30 },
            { id: 3, text: "Need more practice", votes: 4, percentage: 20 },
            { id: 4, text: "Just getting started", votes: 2, percentage: 10 },
        ],
        totalVotes: 20,
        hasVoted: false,
    }

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            // In real app, send to WebSocket
            setChatMessage('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Top Bar */}
            <div className="border-b px-4 py-3 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5 text-primary" />
                        <div>
                            <h1 className="font-semibold">Advanced React Patterns</h1>
                            <p className="text-sm text-muted-foreground">Session 5: React Hooks Deep Dive</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        {participants.length} Online
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        01:24:35
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Help
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Video and Controls */}
                <div className="flex-1 flex flex-col p-4">
                    {/* Main Video Area */}
                    <div className="flex-1 bg-black rounded-lg overflow-hidden mb-4 relative">
                        {/* Teacher's Video (Main) */}
                        <div className="h-full w-full flex items-center justify-center relative">
                            <div className="text-center">
                                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <Video className="h-12 w-12 text-primary/60" />
                                </div>
                                <p className="text-white/80 font-medium">Prof. Sarah Johnson (Host)</p>
                                <p className="text-white/60 text-sm">Sharing screen - React Hooks Examples</p>
                            </div>

                            {/* Video Controls Overlay */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-10 w-10 ${isMuted ? 'bg-destructive/20 text-destructive' : 'bg-white/10 text-white'}`}
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-10 w-10 ${!isVideoOn ? 'bg-destructive/20 text-destructive' : 'bg-white/10 text-white'}`}
                                    onClick={() => setIsVideoOn(!isVideoOn)}
                                >
                                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-10 w-10 ${isScreenSharing ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}
                                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                                >
                                    {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
                                </Button>
                                <Separator orientation="vertical" className="h-6 bg-white/30" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-10 w-10 ${isHandRaised ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white'}`}
                                    onClick={() => setIsHandRaised(!isHandRaised)}
                                >
                                    <Hand className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 bg-white/10 text-white"
                                    onClick={toggleFullscreen}
                                >
                                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                                </Button>
                            </div>

                            {/* Recording Indicator */}
                            {isRecording && (
                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                                    <span className="text-white text-sm">Recording</span>
                                </div>
                            )}

                            {/* Pin Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                                onClick={() => setIsPinned(!isPinned)}
                            >
                                {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Participants Grid */}
                    <div className="h-48 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Participants</h3>
                            <Select defaultValue="grid">
                                <SelectTrigger className="w-[120px] h-8">
                                    <SelectValue placeholder="View" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid">Grid View</SelectItem>
                                    <SelectItem value="list">List View</SelectItem>
                                    <SelectItem value="speakers">Speakers First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <ScrollArea className="h-36">
                            <div className="grid grid-cols-4 gap-3">
                                {participants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className={`relative rounded-lg overflow-hidden border ${participant.isSpeaking ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                                    >
                                        <div className="aspect-video bg-muted flex items-center justify-center">
                                            {participant.isVideoOn ? (
                                                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                    <User className="h-8 w-8 text-primary/60" />
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary/60" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white text-xs truncate">{participant.name}</span>
                                                {participant.role === 'teacher' && (
                                                    <Badge className="h-4 px-1 text-xs">Host</Badge>
                                                )}
                                            </div>
                                        </div>
                                        {participant.isMuted && (
                                            <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center">
                                                <MicOff className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Volume2 className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground w-8">{volume}%</span>
                            </div>
                            <Switch
                                checked={isRecording}
                                onCheckedChange={setIsRecording}
                            />
                            <Label className="text-sm">Record Session</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Airplay className="h-4 w-4" />
                                Cast
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Invite
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-2">
                                <XCircle className="h-4 w-4" />
                                Leave
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Chat and Sidebar */}
                <div className="w-96 border-l flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <TabsList className="grid grid-cols-3 px-4 pt-4">
                            <TabsTrigger value="chat" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Chat
                            </TabsTrigger>
                            <TabsTrigger value="participants" className="gap-2">
                                <Users className="h-4 w-4" />
                                People
                            </TabsTrigger>
                            <TabsTrigger value="materials" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Materials
                            </TabsTrigger>
                        </TabsList>

                        {/* Chat Tab */}
                        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full p-4">
                                    <div className="space-y-4" ref={chatContainerRef}>
                                        {chatMessages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.role === 'teacher' ? 'justify-start' : msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-lg p-3 ${msg.isSystem
                                                        ? 'bg-muted/50 text-center text-sm text-muted-foreground'
                                                        : msg.role === 'teacher'
                                                            ? 'bg-primary/10 border border-primary/20'
                                                            : msg.sender === 'You'
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted'
                                                        }`}
                                                >
                                                    {!msg.isSystem && (
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-medium text-xs ${msg.role === 'teacher' ? 'text-primary' : msg.sender === 'You' ? 'text-primary-foreground' : ''}`}>
                                                                {msg.sender}
                                                            </span>
                                                            {msg.role === 'teacher' && (
                                                                <Badge className="h-4 px-1 text-xs">Teacher</Badge>
                                                            )}
                                                            <span className="text-xs opacity-70">{msg.time}</span>
                                                        </div>
                                                    )}
                                                    <p className="text-sm">{msg.message}</p>
                                                    {!msg.isSystem && (
                                                        <div className="flex justify-end mt-2">
                                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                <ThumbsUp className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder="Type your message..."
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="min-h-[40px] max-h-[120px] resize-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-10 w-10">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Smile className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Zap className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Hand className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Press Enter to send • Shift+Enter for new line
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Participants Tab */}
                        <TabsContent value="participants" className="flex-1 p-0 m-0">
                            <ScrollArea className="h-full p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Class Members</h3>
                                        <Input placeholder="Search participants..." className="w-40" />
                                    </div>

                                    {participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {participant.name}
                                                        {participant.isSpeaking && (
                                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground capitalize">
                                                        {participant.role}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {participant.role === 'teacher' && (
                                                    <Badge>Host</Badge>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        {/* Materials Tab */}
                        <TabsContent value="materials" className="flex-1 p-0 m-0">
                            <ScrollArea className="h-full p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">Class Materials</h3>
                                        <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {materials.map((material) => (
                                            <div
                                                key={material.id}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{material.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {material.size} • {material.uploadedBy}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Poll Section */}
                                    <Card className="mt-6">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <Zap className="h-4 w-4" />
                                                Live Poll
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <p className="font-medium">{poll.question}</p>
                                                <div className="space-y-3">
                                                    {poll.options.map((option) => (
                                                        <div key={option.id} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm">{option.text}</span>
                                                                <span className="text-sm font-medium">{option.percentage}%</span>
                                                            </div>
                                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary rounded-full"
                                                                    style={{ width: `${option.percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {poll.totalVotes} votes • {poll.hasVoted ? 'You have voted' : 'Cast your vote'}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" disabled={poll.hasVoted}>
                                                {poll.hasVoted ? 'Vote Submitted' : 'Vote Now'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default StudentClassPage