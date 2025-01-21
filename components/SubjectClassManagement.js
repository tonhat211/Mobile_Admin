import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet,View, ActivityIndicator,TouchableOpacity,TextInput,FlatList } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../BaseStyle/Style';
import Icon from 'react-native-vector-icons/Ionicons';
import { getRegisterSubjectClassAll,getSubjectClass,updateSubjectClassStudentNum,getTeacherAll,updateSubjectClassInfo, getSubjectAll, searchtSubject, addSubjectClass} from '../service/NLUApiCaller';
import SubjectClass from '../model/SubjectClass';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Subject from '../model/Subject';
import Teacher from '../model/Teacher';
import { backgroundColor } from 'react-native-vietnamese-calendars/src/style';


export default function SubjectClassManagement() {
  const [studentList, setStudentList] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [subjectClassAll, setSubjectClassAll] = useState([]);
  const [subjectClassDetails, setSubjectClassDetails] = useState(new SubjectClass('', '', '', '', '', '', '', '', '', '', '', ''));
  const detailsBSRef = useRef(null);
  const [teacherAll, setTeacherAll] = useState([]);

  const data = [
    { label: 'Toàn trường', value: 'all' },
    { label: 'Theo khóa/khoa', value: 'year_major' }
  ];
  const yearData = [
    { label: 'Năm 2024', value: '2024' },
    { label: 'Năm 2023', value: '2023' },
    { label: 'Năm 2022', value: '2022' },
    { label: 'Năm 2021', value: '2021' },
    { label: 'Năm 2020', value: '2020' },
    { label: 'Năm 2019', value: '2019' },
    { label: 'Năm 2018', value: '2018' }
  ];

  const majorData = [
    { label: 'CNTT', value: 'it' },
    { label: 'Thú Y', value: 'thy' }
  ];

  const daysOfWeek = [
    'CN',  // 0
    'Thứ hai',  
    'Thứ ba',   
    'Thứ tư',   
    'Thứ năm',   
    'Thứ sáu',   
    'Thứ bảy'    // 6
];

const daysOfWeekData = [
  { label: 'CN', value: 0 },
  { label: 'Thứ hai', value: 1 },
  { label: 'Thứ ba', value: 2 },
  { label: 'Thứ tư', value: 3 },
  { label: 'Thứ năm', value: 4 },
  { label: 'Thứ sáu', value: 5 },
  { label: 'Thứ bảy', value: 6 },
];


  useEffect(() => {
    console.log("subject class component");

    setSelectedValue(data[0].value);
    // const isYearSelector = data[0].value === 'year_major';
    // setShowYearSelector(isYearSelector);
    // if (isYearSelector) {
    //     setSelectedYear(yearData[0].value);
    //     setSelectedMajor(majorData[0].value);
    // }
    fetchSubjectClass('all');
    fetchTeacherList();

  }, []);

  const handleDropdownChange = (item) => {
    setSelectedValue(item.value);
    setShowYearSelector(item.value === 'student'); 
    setIsLoading(true); 
    const handleApiResponse = (val) => {
        if (val) {
            setSubjectClassAll(val);  // Cập nhật subjectClassAll với dữ liệu trả về
        } else {
            Toast.show({
                type: 'error',
                text1: 'Có lỗi xảy ra!',
                text2: 'Không thể lấy dữ liệu từ máy chủ',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };
    // getRegisterSubjectClass(item.value)
    // .then(handleApiResponse)
    // .finally(() => setIsLoading(false));
 
};

const fetchSubjectClass = async (queryFilter) => {
  console.log("fetchSubjectClass");
      setIsLoading(true); // Đặt isLoading thành true khi bắt đầu lấy dữ liệu
      try {
        let data;
        if(queryFilter==='all') data = await getRegisterSubjectClassAll();
        // else data = await getLearningFee(queryFilter);
        if (data) {
          setSubjectClassAll(data); 
          if(data.length>0) {
            let theFirstDetail = await getSubjectClass(data[0].id);
            if(theFirstDetail) 
              setSubjectClassDetails(theFirstDetail);
          }

        } else {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra!',
            text2: 'Không thể lấy dữ liệu lịch thi',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu lịch thi',
          visibilityTime: 2000,
          autoHide: true,
        });
      } finally {
        setIsLoading(false); 
      }
};

const handleYearDropdownChange = (item) => {
  setSelectedValue(item.value);
  setShowYearSelector(item.value === 'student'); 
  setIsLoading(true); 
  // Hàm để xử lý API và hiển thị lỗi nếu không có dữ liệu
  const handleApiResponse = (val) => {
      if (val) {
          setSubjectClassAll(val);  // Cập nhật subjectClassAll với dữ liệu trả về
      } else {
          // Hiển thị thông báo lỗi nếu không có dữ liệu
          Toast.show({
              type: 'error',
              text1: 'Có lỗi xảy ra!',
              text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
              visibilityTime: 2000,
              autoHide: true,
          });
      }
  };
  getRegisterSubjectClass(item.value)
  .then(handleApiResponse)
  .finally(() => setIsLoading(false));

};

  const SubjectClassContainer = ({ item }) => {
    console.log("SubjectClassContainer");
    return (
      <View style={styles.table}>
        <View style={styles.headerPane}>
            <View style={styles.headerRow}>
                <Text style={[styles.header, { flex: 0.6}]}>Môn</Text>
                <Text style={[styles.header, { flex: 0.15 }]}>Nhóm</Text>
                <Text style={[styles.header, { flex: 0.2 }]}>Thời gian</Text>
                {/* <Text style={[styles.header, { flex: 0.1 }]}>Chọn</Text> */}
            </View>
        </View>
        <View style={styles.tablePane}>
            {subjectClassAll.length > 0 ? (
                <FlatList 
                    data={item} 
                    keyExtractor={item => item.id} 
                    renderItem={classItem} 
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={true}
                />
            ) : (
                <View style={[styles.row,]}>
                    <Text style={{ textAlign: 'center', flex: 1, color: 'gray' }}>Không có lớp học nào</Text>
                </View>
            )}
        </View>
      </View>
    );
  }

  const classItem = ({ item }) => {
    const rowStyle = item.qty === 0 ? [styles.row, { backgroundColor: 'red' }] : styles.row;
    const handlePress = async () => {
      console.log("press: " + item.id);
        const selectedSubjectClass = await getSubjectClass(item.id);
        setSubjectClassDetails(selectedSubjectClass);
        console.log(JSON.stringify(subjectClassDetails,null,2));
        detailsBSRef.current.snapToIndex(1);
    };


    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={rowStyle}>
                <Text style={[styles.pH5, { flex: 0.6 }]}>
                    <Text style={{ paddingLeft: 10 }}>{item.subjectclass.subject.id}</Text>
                    {'\n'}
                    <Text numberOfLines={1}>
                        {item.subjectclass.subject.name}
                    </Text>
                </Text>
                <Text style={[styles.pH5, { flex: 0.15}]}>{item.subjectclass.team}</Text>
                <Text style={[styles.pH5, { flex: 0.2}]}>
                    <Text>{daysOfWeek[item.subjectclass.day]}</Text>
                    {'\n'}
                    <Text>
                        Tiết {item.subjectclass.startLesson}
                    </Text>
                </Text>
              
            </View>
        </TouchableOpacity>
    )
}

const [isModalVisible, setIsModalVisible] = useState(false);
const [isUpdateInfoModalVisible, setIsUpdateInfoModalVisible] = useState(false);
const toggleQuantityModal = () => {
  setIsModalVisible(!isModalVisible);
};

const toggleUpdateInfoModal = () => {
  console.log("toggel update intfo: " + isUpdateInfoModalVisible);
  setIsUpdateInfoModalVisible(!isUpdateInfoModalVisible);
  if(isUpdateInfoModalVisible) {

  }
};

const fetchTeacherList = async () => {
  console.log("fetchTeacherList");
  let data = await getTeacherAll();
  if (data) {
    const teacherAllData = data.map((teacher) => ({
      label: teacher.name, // Tên giáo viên hiển thị trong Dropdown
      value: teacher.id,   // Giá trị đại diện (có thể là ID hoặc bất kỳ giá trị nào bạn muốn)
    }));
    setTeacherAll(teacherAllData); 
    console.log("Giao vien: "+ teacherAll.length);
  } else {
    Toast.show({
      type: 'error',
      text1: 'Có lỗi xảy ra!',
      text2: 'Không thể lấy dữ liệu giáo viên',
      visibilityTime: 2000,
      autoHide: true,
    });
  }
};
      

    
const SubjectDetails = ({ subjectClass, onUpdateStudentNum, onUpdateSubjectClassInfo }) => {
// so luong
  const [newStudentNum, setNewStudentNum] = useState(subjectClass.studentNum);

// thong tin
  const [newTeamValue, setNewTeamValue] = useState(subjectClassDetails.team);
  const [newLessonNumValue, setNewLessonNumValue] = useState(subjectClassDetails.lessonNum);
  const [newDayValue, setNewDayValue] = useState(subjectClassDetails.day);
  const [newStartLessonValue, setNewStartLessonValue] = useState(subjectClassDetails.startLesson);
  const [newStartDateValue, setNewStartEndDateValue] = useState(new Date(subjectClassDetails.startDate));
  const [newEndDateValue, setNewEndDateValue] = useState(new Date(subjectClassDetails.endDate));
  const [newTeacherId, setNewTeacherId] = useState(subjectClassDetails.teacher.id);
  const [newTeacherName, setNewTeacherName] = useState(subjectClassDetails.teacher.name);
  const defaultTeacher = teacherAll.find(
    (teacher) => teacher.value === subjectClassDetails.teacher.id
  );
  const [selectedNewTeacher, setSelectedNewTeacher] = useState(
    defaultTeacher?.value || null 
  );
console.log("new start date: " + newStartDateValue);
const handleChangeTeacher = (item) => {
  setNewTeacherId(item.id);
  setNewTeacherName(item.label); // Giả sử bạn lưu tên giáo viên trong label
};
const handleChangeDay = (item) => {
  setNewDayValue(item.value);
};
const createSubjectDetailFromSubjectClass = () => {
  const subjectDetail = {
    ...subjectClassDetails,
    team: newTeamValue, 
    lessonNum: newLessonNumValue, 
    day: newDayValue, 
    startLesson: newStartLessonValue, 
    startDate: newStartDateValue, 
    endDate: newEndDateValue, 
    teacher: {
      ...subjectClassDetails.teacher, 
      id: newTeacherId, 
      name: newTeacherName, 
    },
  };
  return subjectDetail;
};
const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
const showStartDatePicker = () => {

  setStartDatePickerVisibility(true);
  console.log("isStartDatePickerVisible:"+isStartDatePickerVisible);
};
const showEndDatePicker = () => {
  setEndDatePickerVisibility(true);
};
const hideDatePicker = () => {
  setStartDatePickerVisibility(false);
  setEndDatePickerVisibility(false);
};
const handleStartDateChange = (date) => {
  setNewStartEndDateValue(date);
  hideDatePicker();
};
const handleEndDateChange = (date) => {
  setNewEndDateValue(date);
  hideDatePicker();
};
  return (
    <View style={styles.bottom}>
      <View style={{ flexDirection: 'column', width: '95%', alignSelf: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          {subjectClass.subject.name} ({subjectClass.subject.id})
        </Text>
        <View
          style={[
            styles.rowDetails,
            { backgroundColor: 'lightgray', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
          ]}
        >
          <Text style={styles.textDetails}>Nhóm: {subjectClass.team}</Text>
          <Text style={styles.textDetails}>Số TC: {subjectClass.subject.credit}</Text>
        </View>
        <View style={[styles.rowDetails, { backgroundColor: '#eeeeee' }]}>
          <Text style={styles.textDetails}>Thứ: {daysOfWeek[subjectClass.day]}</Text>
          <Text style={styles.textDetails}>Tiết BD: {subjectClass.startLesson}</Text>
          <Text style={styles.textDetails}>Số tiết: {subjectClass.lessonNum}</Text>
        </View>
        <View style={[styles.rowDetails, { backgroundColor: 'lightgray' }]}>
          <Text style={styles.textDetails}>Số lượng: {subjectClass.studentNum}</Text>
          <Text style={styles.textDetails}>Còn lại: {subjectClass.remainingQty}</Text>
        </View>
        <View style={[styles.rowDetails, { backgroundColor: '#eeeeee' }]}>
          <Text style={styles.textDetails}>Giáo viên: {subjectClass.teacher.name}</Text>
        </View>

        {/* Thêm hai nút */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleQuantityModal}
          >
            <Text style={styles.buttonText}>Cập nhật số lượng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#007bff' }]}
            onPress={toggleUpdateInfoModal}
          >
            <Text style={styles.buttonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal Cập nhật số lượng */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleQuantityModal}
        onBackButtonPress={toggleQuantityModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cập nhật số lượng</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(newStudentNum)}
            onChangeText={(text) => setNewStudentNum(Number(text))} // Cập nhật state khi nhập
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onUpdateStudentNum(subjectClass.id, newStudentNum);
              toggleQuantityModal();
            }}
          >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Modal Cập nhật thông tin */}
      <Modal
        isVisible={isUpdateInfoModalVisible}
        onBackdropPress={toggleUpdateInfoModal}
        onBackButtonPress={toggleUpdateInfoModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cập nhật thông tin lớp học</Text>
          <View style={{ flexDirection: 'column', width: '95%', alignSelf: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {subjectClassDetails.subject.name} ({subjectClassDetails.subject.id})
            </Text>
          <View style={[styles.rowDetails,{},]}>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Nhóm:</Text>
              <TextInput style={[styles.input, {margin:0}]} value={newTeamValue?newTeamValue:subjectClassDetails.team} onChangeText={(text) => setNewTeamValue(text)} />
            </View>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Số tiết:</Text>
              <TextInput style={[styles.input, {margin:0}]} value={String(newLessonNumValue?newLessonNumValue:subjectClassDetails.lessonNum)} onChangeText={(text) => setNewLessonNumValue(Number(text))} /> 
            </View>
          </View>
          <View style={[styles.rowDetails,{},]}>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Thứ:</Text>
              <Dropdown
                style={styles.dropdown}
                data={daysOfWeekData}
                labelField="label"
                valueField="value"
                placeholder="Chọn thứ"
                value={subjectClassDetails.day}  
                onChange={handleChangeDay}  
              />
            </View>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Tiết bắt đầu:</Text>
              <TextInput style={[styles.input, {margin:0}]} value={String(newStartLessonValue?newStartLessonValue:subjectClassDetails.startLesson)} onChangeText={(text) => setNewStartLessonValue(Number(text))} /> 
            </View>
          </View>
          <View style={[styles.rowDetails,{},]}>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Từ:</Text>
              <TouchableOpacity onPress={showStartDatePicker} style={styles.datePickerButton}>
                <TextInput style={[styles.input, { margin: 0 }]} 
                  value={newStartDateValue ? newStartDateValue.toLocaleDateString() : ''}
                  editable={false}  
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                date={newStartDateValue}
                onConfirm={handleStartDateChange}
                onCancel={hideDatePicker}
              />
            </View>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Đến:</Text>
              <TouchableOpacity onPress={showEndDatePicker} style={styles.datePickerButton}>
                <TextInput style={[styles.input, { margin: 0 }]} 
                  value={newEndDateValue ? newEndDateValue.toLocaleDateString() : ''}
                  editable={false}  
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                date={newEndDateValue}
                onConfirm={handleEndDateChange}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View style={[styles.rowDetails,{},]}>
            <View style={[{backgroundColor: 'white',flex:1}]}>
              <Text style={styles.inputLabel}>Giáo viên:</Text>
              <Dropdown
                style={styles.dropdown}
                data={teacherAll}
                labelField="label"
                valueField="value"
                placeholder="Chọn giáo viên"
                value={selectedNewTeacher}
                onChange={handleChangeTeacher} 
              />
            </View>
           
          </View>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              const subjectDetail = createSubjectDetailFromSubjectClass(); // Tạo subjectDetail từ subjectClassDetails
              onUpdateSubjectClassInfo(subjectDetail); // Gửi subjectDetail qua API
              toggleUpdateInfoModal(); // Đóng modal
            }}
            >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
  </Modal>
    </View>
  );
};

 

const updateStudentNum = async (id, quantity) => {
  console.log("update student num");
  try {
    const updatedData = await updateSubjectClassStudentNum(id, quantity);
    if (!updatedData || updatedData.error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: updatedData.error,  
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      setSubjectClassDetails((prevDetails) => ({
        ...prevDetails,
        studentNum: updatedData.studentNum, 
        remainingQty: updatedData.remainingQty, 
      }));
      Toast.show({
        type: 'success',
        text1: 'Cập nhật thành công!',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Có lỗi xảy ra!',
      text2: error.message || 'Lỗi không xác định.',
      visibilityTime: 2000,
      autoHide: true,
    });
  }
};

const updateSubjectClassItem = (updatedSubject) => {
  console.log("updateSubjectClassItem:"+ JSON.stringify(updatedSubject))
  setSubjectClassAll(prevState => {
    console.log("Previous state:", JSON.stringify(prevState));
    
    return prevState.map(subClass => 
      subClass.id === updatedSubject.id 
      ? { ...subClass, team: updatedSubject.team, room: updatedSubject.room, day: updatedSubject.day, startLesson: updatedSubject.startLesson }
      : subClass
    );
  })
};

const updateSubjectClass = async (item) => {
  console.log("updateSubjectClassInfo");

  // Format ngày theo định dạng YYYY-MM-DD
  let date = new Date(item.startDate);  
  let formattedDate = date.toISOString().split('T')[0];
  item.startDate = formattedDate;

  date = new Date(item.endDate);  
  formattedDate = date.toISOString().split('T')[0];
  item.endDate = formattedDate;
  try {
    const updatedData = await updateSubjectClassInfo(item);
  
    if (!updatedData || updatedData.error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: updatedData.error,  
        visibilityTime: 2000,
        autoHide: true,
      });
     
    } else {
      setSubjectClassDetails(updatedData);
      Toast.show({
        type: 'success',
        text1: 'Cập nhật thành công!',
        visibilityTime: 2000,
        autoHide: true,
      });
      console.log("updatedData" +JSON.stringify(updatedData));
      updateSubjectClassItem(updatedData);
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Có lỗi xảy ra!',
      text2: error.message || 'Lỗi không xác định.',
      visibilityTime: 2000,
      autoHide: true,
    });
  }
};

const [isAddSubjectClassModalVisible, setIsAddSubjectClassModalVisible] = useState(false);
const toggleAddSubjectClassModal = () => {
  console.log("toggleAddSubjectClassModal");
  setIsAddSubjectClassModalVisible(!isAddSubjectClassModalVisible);
};


const AddSubjectClassModal =() => {
  const [formState, setFormState] = useState({
    newSubjectID: '',
    newStudentNum: '',
    newTeamValue: '01',
    newLessonNumValue: '3',
    newDayValue: 1,
    newStartLessonValue: '',
    newStartDateValue: new Date(),
    newEndDateValue: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    newTeacherId: '',
    newTeacherName: '',
    newClassID: '',
    newRoom:''
  });

  const handleFormChange = (field, value) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log('Submitted Data:');
    const subject = new Subject(formState.newSubjectID);

    const teacher = new Teacher(formState.newTeacherId);
    console.log("teacher:" + formState.newTeacherId);
    console.log("newTeamValue:" + formState.newTeamValue);
    console.log("newClassID:" + formState.newClassID);
    console.log("newStartLessonValue:" + formState.newStartLessonValue);
    console.log("newLessonNumValue:" + formState.newLessonNumValue);
    console.log("newDayValue:" + formState.newDayValue);
    console.log("newRoomValue:" + formState.newRoomValue);
    console.log("newStudentNum:" + formState.newStudentNum);
    console.log("newStartDateValue:" + formState.newStartDateValue);
    console.log("newEndDateValue:" + formState.newEndDateValue);
    console.log("newStudentNum:" + formState.newStudentNum);
    const subjectClass = new SubjectClass(
      0,formState.newTeamValue,formState.newClassID,subject,teacher,formState.newStartLessonValue,formState.newLessonNumValue,formState.newDayValue,
      formState.newRoomValue,formState.newStudentNum,formState.newStartDateValue,formState.newEndDateValue,formState.newStudentNum
    );
    // (id, team, classID, subject, teacher, startLesson, lessonNum, day, room, studentNum, startDate, endDate,remainingQty) {
    console.log("subjectClass: " +JSON.stringify(subjectClass));

    let date = new Date(subjectClass.startDate);  
    let formattedDate = date.toISOString().split('T')[0];
    subjectClass.startDate = formattedDate;
    console.log("start: " +formattedDate);
  
    date = new Date(subjectClass.endDate);  
    formattedDate = date.toISOString().split('T')[0];
    subjectClass.endDate = formattedDate;
    console.log("endDate: " +formattedDate);


    try {
      console.log('try add');
      const updatedData = await addSubjectClass(subjectClass);
      fetchSubjectClass("all");
    
      if (!updatedData || updatedData.error) {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: updatedData.error,  
          visibilityTime: 2000,
          autoHide: true,
        });
       
      } else {
        setSubjectClassDetails(updatedData);
        Toast.show({
          type: 'success',
          text1: 'Thêm thành công!',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: error.message || 'Lỗi không xác định.',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  
    
  };

  const handleChangeTeacher = (item) => {
    handleFormChange('newTeacherId', item.value)
    handleFormChange('newTeacherName',item.label)

  };

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };
  const handleStartDateChange = (date) => {
    handleFormChange('newStartDateValue', date)
    hideDatePicker();
  };
  const handleEndDateChange = (date) => {
    handleFormChange('newEndDateValue', date)
    hideDatePicker();
  };

  const [searchInput, setSearchInput] = useState(""); 
  const [subject,setSubject] = useState(""); 
  const onSearchtSubject = async (searchInput) => {
      console.log("searchSubjectClass");
      if(searchInput!='') {
        try {
          // if(searchInput==='') return;
          const res = await searchtSubject(searchInput); 
          console.log(res);
          setSubject(res);
          if(res) {
            // formState.newSubjectID = res.id;
            handleFormChange('newSubjectID', res.id)
          }
           
      } catch (error) {
          console.error("Error during search:", error);
      }
      }
   
  };

  return (
    <Modal
    isVisible={isAddSubjectClassModalVisible}
    onBackdropPress={toggleAddSubjectClassModal}
    onBackButtonPress={toggleAddSubjectClassModal}
    >
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Mở thêm lớp học</Text>
      <View style={{ flexDirection: 'column', width: '95%', alignSelf: 'center' }}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
            <TouchableOpacity onPress={() => onSearchtSubject(searchInput)} >
                <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
            </TouchableOpacity>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm môn học..."
                value={searchInput} 
                onChangeText={(text) => {
                  if (text !== '') 
                    setSearchInput(text);
                  else {}
                }} 
            />
        </View>
        <View style={styles.searchCancel}>
            <TouchableOpacity onPress={() => setSearchInput("")} >
                <Text style={styles.searchCancelText}>Hủy</Text>
            </TouchableOpacity>
        </View>
    
        
    </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          {subject.name} ({subject.id})
        </Text>
      <View style={[styles.rowDetails,{},]}>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Nhóm:</Text>
          <TextInput style={[styles.input, {margin:0}]} onChangeText={(value) => handleFormChange('newTeamValue', value)} />
        </View>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Phòng:</Text>
          <TextInput style={[styles.input, {margin:0}]} onChangeText={(value) => handleFormChange('newRoomValue', value)} /> 
        </View>
      </View>
      <View style={[styles.rowDetails,{},]}>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Số lượng:</Text>
          <TextInput style={[styles.input, {margin:0}]} onChangeText={(value) => handleFormChange('newStudentNum', value)} />
        </View>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Lớp học:</Text>
          <TextInput style={[styles.input, {margin:0}]} onChangeText={(value) => handleFormChange('newClassID', value)} /> 
        </View>
      </View>
      <View style={[styles.rowDetails,{},]}>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Thứ:</Text>
          <Dropdown
            style={styles.dropdown}
            data={daysOfWeekData}
            labelField="label"
            valueField="value"
            placeholder="Chọn thứ"
            // value={formState.day}  
            onChange={(value) => handleFormChange('newDayValue', value.value)} 
          />
        </View>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Tiết bắt đầu:</Text>
          <TextInput style={[styles.input, {margin:0}]} 
            // value={formState.newStartLessonValue}  
            onChangeText={(value) => handleFormChange('newStartLessonValue', value)} /> 
        </View>
      </View>
      <View style={[styles.rowDetails,{},]}>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Từ:</Text>
          <TouchableOpacity onPress={showStartDatePicker} style={styles.datePickerButton}>
            <TextInput style={[styles.input, { margin: 0 }]} 
              value={formState.newStartDateValue ? formState.newStartDateValue.toLocaleDateString() : ''}
              editable={false}  
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            date={formState.newStartDateValue}
            onConfirm={handleStartDateChange}
            onCancel={hideDatePicker}
          />
        </View>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Đến:</Text>
          <TouchableOpacity onPress={showEndDatePicker} style={styles.datePickerButton}>
            <TextInput style={[styles.input, { margin: 0 }]} 
              value={formState.newEndDateValue ? formState.newEndDateValue.toLocaleDateString() : ''}
              editable={false}  
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            date={formState.newEndDateValue}
            onConfirm={handleEndDateChange}
            onCancel={hideDatePicker}
          />
        </View>
      </View>
      <View style={[styles.rowDetails,{},]}>
        <View style={[{backgroundColor: 'white',flex:1}]}>
          <Text style={styles.inputLabel}>Giáo viên:</Text>
          <Dropdown
            style={styles.dropdown}
            data={teacherAll}
            labelField="label"
            valueField="value"
            placeholder="Chọn giáo viên"
            // value={formState.newEndDateValue}
            onChange={handleChangeTeacher} 
          />
        </View>
       
      </View>
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          // const subjectDetail = createSubjectDetailFromSubjectClass(); 
          // onUpdateSubjectClassInfo(subjectDetail); // Gửi subjectDetail qua API
          handleSubmit();
          toggleAddSubjectClassModal(); 
        }}
        >
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
    </Modal>
  );

}


return (

  <View style={styles.container}>
    <View style={[styles.row,{alignItems:'center',backgroundColor:'white'}]}>
    <View style={[{width: '85%'}]}>
        <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Chọn đối tượng"
        value={selectedValue}
        onChange={handleDropdownChange} 
        /> 
      </View>
      <View style={[{width: '15%', textAlign:'center'}]}>
        <TouchableOpacity onPress={toggleAddSubjectClassModal} >
            <Text style={[{marginHorizontal: 5,color:'#007AFF'}] }>Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{ flexDirection: 'column', width: '95%', alignSelf: 'center' }}>
      <AddSubjectClassModal/>

    </View>
  
  {showYearSelector && (
    <View style={[styles.row, {justifyContent: 'space-between'}]}>
      <View style={[styles.cell, {paddingRight:'10'}]}>
        <Dropdown
            style={[styles.dropdown]}
            data={yearData}
            labelField="label"
            valueField="value"
            placeholder="Chọn năm"
            value={selectedYear}
            onChange={handleYearDropdownChange} 
          /> 
      </View>
      <View style={[styles.cell, {paddingLeft:'10'}]}>
        <Dropdown
            style={[styles.dropdown]}
            data={yearData}
            labelField="label"
            valueField="value"
            placeholder="Chọn năm"
            value={selectedYear}
            onChange={handleYearDropdownChange} 
          /> 
      </View>
   
    </View>
     
  )}   
  {/* <ExamScheduleContainer item={exams} /> */}
   {isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2bc250" />
    </View>
  ) : (
    // <></>
    <SubjectClassContainer item={subjectClassAll} />
  )}
  <BottomSheet ref={detailsBSRef} snapPoints={['1%','50%', '60%']} enablePanDownToClose={true}>
      {/* <SubjectDetails subjectClass={subjectClassDetails} /> */}
      <SubjectDetails
        subjectClass={subjectClassDetails}
        onUpdateStudentNum={(id, quantity) => updateStudentNum(id, quantity)}
        onUpdateSubjectClassInfo={(item) => updateSubjectClass(item)}
/>
  </BottomSheet>
 
</View>


);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 16,
},
dropdown: {
  marginTop: 5,
  width: '100%',
  height: 40,
  borderWidth: 1,
  borderColor: 'black',
  borderRadius: 10,
  paddingHorizontal: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
examScheduleContainer: {
  marginTop: 16,
},
examTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
examScheduleText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
},
  subjectsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
subjectContainer: {
width: '100%', 
marginBottom: 8,
padding: 8,
borderWidth: 1,
borderColor: colors.borderColor, 
borderRadius: 8,
backgroundColor: colors.backgroundColor,
shadowColor: '#000',
shadowOffset: { width: 0, height: 3 },
shadowOpacity: 0.2,
shadowRadius: 4,
elevation: 5,
},
scoreContainer: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' , marginTop: 10
},
scoreItem: {
flex: 1, textAlign: 'left'
},

row: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  // padding: 10,
  backgroundColor:'#98FB98'
},
cell: {
  flex: 1,
  textAlign: 'center',

},
cellName: {
  flex: 3,
  paddingHorizontal: 10,
},

loadingContainer: {
  position: 'absolute',
  zIndex: 1,
  backgroundColor: '#bec4c2',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -75 }, { translateY: 0 }],
  width: 150,
  height: 150,
  justifyContent: 'center',
  borderRadius: 10,
  opacity: 0.8,
},
searchContainer: {
  flexDirection: 'row', 
  alignItems: 'center', 
  width: '90%',
  marginTop: 16, 
},
searchBox: {
  flexDirection: 'row', 
  alignItems: 'center', 
  width: '90%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,  
},
searchIcon: {marginHorizontal: 8 },
searchInput: {flex: 1,padding: 4,},
searchCancel: {
  flex: 1, // Để container chiếm toàn bộ chiều cao và chiều rộng của view cha
  justifyContent: "center", // Căn giữa theo chiều dọc
  alignItems: "center",
},
searchCancelText: {
  color: "#007AFF",
},
table: {
  width: '95%',
  marginHorizontal: 'auto',
  marginTop: 10,
},
headerPane: {

},
headerRow: {
  flexDirection: 'row'
},
header: {
  fontWeight: 'bold',
  paddingHorizontal: 5
},
tablePane: {
  maxHeight: '90%'
},
row: {
  flexDirection: 'row',
  backgroundColor: '#B4E1B1',
  marginTop: 5,
  marginBottom: 5,
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 5,
},
pH5: {
  paddingHorizontal: 5
},
rowDetails: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 10,
},
textDetails: {
  fontSize: 15,

},
button: {
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
  flex: 1,
  marginHorizontal: 5,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
modalContent: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  width: '80%',
  padding: 10,
  marginBottom: 20,
  borderRadius: 5,
},
saveButton: {
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 5,
},
saveButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
inputLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'black',
},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical:0,
  paddingHorizontal: 5,
},
bottom: {
  backgroundColor:'#B4E1B1',
}
});

