import PropTypes from "prop-types";

function UserProfile({
  name,
  age,
  isStutent,
  handleClick,
  hobbies,
  address,
  friends,
  tags,
  status,
}) {
  return (
    <>
    {JSON.stringify(tags)}
    {status}
      <h1>姓名: {name}</h1>
      <p>年齡: {age}</p>
      <p>是否為學生: {isStutent ? "是" : "否"}</p>
      <ul>
        {friends.map((item, index) => (
          <li key={index}>{item.name}:{" "}{item.age}</li>
        ))}
      </ul>
      {/* 下略... */}
    </>
  );
}
export default UserProfile;

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isStutent: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  hobbies: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
  }),
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
    })
  ),
  tags: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        type: PropTypes.string,
        description: PropTypes.string,
      }),
      PropTypes.bool,
    ])
  ),
  status: PropTypes.oneOf(["啟用", "暫停", "未完成 "]),
};

UserProfile.defaultProps = {
  name: "在 React 19 中 propTypes 警告會失效",
};
