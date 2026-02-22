import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockUsers';
import { Briefcase, ChevronRight } from 'lucide-react';

export default function UserDirectory() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Community Directory</h1>
                <p className="text-slate-500 mt-1">Discover other engineers and review their skill profiles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_USERS.map((user) => (
                    <Link
                        key={user.id}
                        to={`/users/${user.id}`}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {user.profile.fullName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.profile.fullName}</h3>
                                <p className="text-sm text-slate-500">{user.profile.title}</p>
                            </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-6 line-clamp-2 h-10">
                            {user.profile.bio}
                        </p>

                        <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-1">
                                <Briefcase size={14} />
                                <span>{user.profile.yearsOfExperience} years exp</span>
                            </div>
                            <div className="flex items-center gap-1 text-indigo-600 font-medium">
                                View Profile
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
