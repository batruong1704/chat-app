import React, { useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import SelectedMember from './SelectedMember';
import { ChatCard } from '../ChatCard/ChatCard';
import NewGroup from './NewGroup';
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";

const CreateGroup = ({ setIsGroup }) => {
  const [newGroup, setNewGroup] = useState(false);
  const [query, setQuery] = useState('');
  const [groupMember, setGroupMember] = useState(new Set());
  const token = localStorage.getItem('token');
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleRemoveMember = (memberId) => {
    const updatedMembers = new Set(groupMember);
    const memberToRemove = Array.from(updatedMembers).find(m => m.id === memberId);
    if (memberToRemove) {
      updatedMembers.delete(memberToRemove);
      setGroupMember(updatedMembers);
    }
  };

  const handleNavigate = () => {
    setIsGroup(false);
  };

  const handleSearch = (key) => {
    if (key.trim()) {
      dispatch(searchUser({ key, token }));
    }
  }

  return (
    <div className='w-full h-full'>
      {!newGroup && (
        <div>
          <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
            <BsArrowLeft
              className='cursor-pointer text-2xl font-bold'
              onClick={handleNavigate}
            />
            <p className='text-xl font-semibold'>Tạo nhóm</p>
          </div>

          {/* Search and Selected Members */}
          <div className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {groupMember.size > 0 &&
                  Array.from(groupMember).map((item) => (
                    <SelectedMember
                      key={item.id}
                      handleRemoveMember={() => handleRemoveMember(item.id)}
                      member={item}
                    />
                  ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value.trim()) {
                      handleSearch(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Tìm kiếm bạn bè"
                  value={query}
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-6">
              {query && auth.searchUser?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const updatedMembers = new Set(groupMember);
                    // Check to prevent adding duplicate members
                    const existingMember = Array.from(updatedMembers).find(m => m.id === item.id);
                    if (!existingMember) {
                      updatedMembers.add(item);
                      setGroupMember(updatedMembers);
                      setQuery('');
                    }
                  }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ChatCard userImg={item.profile_picture} name={item.full_name} />
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-6xl mx-auto flex justify-center">
              <button
                onClick={() => {
                  if (groupMember.size > 0) {
                    setNewGroup(true);
                  }
                }}
                disabled={groupMember.size === 0}
                className={`bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-colors transform hover:scale-105 
                  ${groupMember.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <BsArrowRight className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      )}
      {newGroup && <NewGroup setIsGroup={setIsGroup} groupMember={groupMember} />}
    </div>
  );
};

export default CreateGroup;