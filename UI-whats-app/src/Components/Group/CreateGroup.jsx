import React, { useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import SelectedMember from './SelectedMember';
import { ChatCard } from '../ChatCard/ChatCard';
import NewGroup from './NewGroup';
import {useDispatch, useSelector} from "react-redux";
import {searchUser} from "../../Redux/Auth/Action";

const CreateGroup = ({ setIsGroup }) => {
  const [newGroup, setNewGroup] = useState(false);
  const [query, setQuery] = useState('');
  const [groupMember, setGroupMember] = useState(new Set());
  const token = localStorage.getItem('token');
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleRemoveMember = (member) => {
    groupMember.delete(member);
    setGroupMember(groupMember);
  };

  const handleNavigate = () => {
    setIsGroup(false);
  };

  const handleSearch=(key)=> {
    if (key.trim()) {  // Chỉ tìm kiếm nếu có thông tin đầu vào thực tế
      dispatch(searchUser({key, token}));
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

              {/* Rest of the component remains the same */}
              <div className='relative bg-white py-4 px-3'>
                <div className='flex space-x-2 flex-wrap space-y-1'>
                  {groupMember.size > 0 &&
                      Array.from(groupMember).map((item, index) => (
                          <SelectedMember
                              key={index}
                              handleRemoveMember={() => handleRemoveMember(item)}
                              member={item}
                          />
                      ))}
                </div>
                <input
                    type='text'
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (e.target.value.trim()) {
                        handleSearch(e.target.value);
                      }
                    }}
                    className='outline-none border-b border-[#8888] p-2 w-[93%]'
                    placeholder='Tìm kiếm bạn bè'
                    value={query}
                />
              </div>

              <div className='bg-white overflow-y-scroll h-[50.2vh]'>
                {query &&
                    auth.searchUser?.map((item, index) => (
                        <div
                            onClick={() => {
                              const updatedMembers = new Set(groupMember);
                              updatedMembers.add(item);
                              setGroupMember(updatedMembers);
                              setQuery('');
                            }}
                            key={index}
                        >
                          <hr />
                          <ChatCard userImg={item.profile_picture} name={item.full_name} />
                        </div>
                    ))}
              </div>

              <div className='bottom-10 py-10 bg-slate-200 flex items-center justify-center'>
                <div className='bg-green-600 rounded-full p-4 cursor-pointer'
                    onClick={() => setNewGroup(true)}>
                  <BsArrowRight className='text-white font-bold text-3xl' />
                </div>
              </div>
            </div>
        )}
        {newGroup && <NewGroup setIsGroup={setIsGroup} groupMember = {groupMember}/>}
      </div>
  );
};

export default CreateGroup;