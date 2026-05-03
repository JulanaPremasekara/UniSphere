import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Image,
  Modal,
  GestureResponderEvent,
  TextInputSubmitEditingEvent,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import {
  X,
  Camera,
  Calendar as CalendarIcon,
  MapPin,
  Plus,
  CheckCircle2,
  Clock,
  Minus,
} from "lucide-react-native";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import Footer from "../components/Footer";
import apiClient from "../services/api";
import { tags } from "react-native-svg/lib/typescript/xmlTags";
import form from "../components/form";

const CalendarModal = ({
  visible,
  onClose,
  onSelectDate,
  currentMonth,
  setCurrentMonth,
}: any) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = [];
  let day = 1;
  for (let i = 0; i < 6; i++) {
    let week = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
        week.push(
          <View
            key={`${i}-${j}`}
            className="w-10 h-10 items-center justify-center"
          />,
        );
      } else {
        const d = day;
        week.push(
          <TouchableOpacity
            key={`${i}-${j}`}
            onPress={() => onSelectDate(new Date(year, month, d))}
            className="w-10 h-10 items-center justify-center rounded-full hover:bg-indigo-50"
          >
            <Text className="text-gray-800 font-semibold">{d}</Text>
          </TouchableOpacity>,
        );
        day++;
      }
    }
    grid.push(
      <View key={i} className="flex-row justify-around my-1">
        {week}
      </View>,
    );
    if (day > daysInMonth) break;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white w-full max-w-sm rounded-[30px] p-6 shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-2 bg-gray-50 rounded-xl"
            >
              <Minus size={20} color="#4F46E5" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">
              {months[month]} {year}
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-2 bg-gray-50 rounded-xl"
            >
              <Plus size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-around mb-2">
            {days.map((d) => (
              <Text
                key={d}
                className="w-10 text-center text-gray-400 font-bold text-[10px] uppercase tracking-wider"
              >
                {d}
              </Text>
            ))}
          </View>
          {grid}
          <TouchableOpacity
            onPress={onClose}
            className="mt-6 bg-gray-100 p-4 rounded-2xl items-center"
          >
            <Text className="text-gray-600 font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const TimeModal = ({ visible, onClose, onSelectTime }: any) => {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const hours = [
    "12",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
  ];
  const minutes = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ];

  const handleConfirm = () => {
    let h = parseInt(selectedHour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    onSelectTime(`${h.toString().padStart(2, "0")}:${selectedMinute}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-black text-gray-900">
              Select Time
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 p-3 rounded-full"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row h-72 mb-10">
            <View className="flex-1">
              <Text className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">
                Hour
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {hours.map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => setSelectedHour(h)}
                    className={`py-4 items-center rounded-2xl mb-1 ${selectedHour === h ? "bg-indigo-600" : ""}`}
                  >
                    <Text
                      className={`text-xl font-bold ${selectedHour === h ? "text-white" : "text-gray-400"}`}
                    >
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="w-[1px] bg-gray-100 mx-4 h-full" />

            <View className="flex-1">
              <Text className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">
                Minute
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {minutes.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setSelectedMinute(m)}
                    className={`py-4 items-center rounded-2xl mb-1 ${selectedMinute === m ? "bg-indigo-600" : ""}`}
                  >
                    <Text
                      className={`text-xl font-bold ${selectedMinute === m ? "text-white" : "text-gray-400"}`}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="w-[1px] bg-gray-100 mx-4 h-full" />

            <View className="flex-1 justify-center gap-4">
              {["AM", "PM"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeriod(p)}
                  className={`py-6 items-center rounded-2xl ${period === p ? "bg-indigo-100 border border-indigo-200" : "bg-gray-50"}`}
                >
                  <Text
                    className={`text-lg font-black ${period === p ? "text-indigo-600" : "text-gray-400"}`}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-indigo-600 p-6 rounded-[30px] items-center shadow-xl shadow-indigo-100"
          >
            <Text className="text-white font-black text-lg uppercase tracking-widest">
              Confirm Time
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FormField = ({
  label,
  place,
  val,
  field,
  icon: IconComp,
  onIconPress,
  multiline = false,
  className = "",
  updateForm,
  error,
}: any) => {
  const isNumeric = [
    "startDate",
    "endDate",
    "startTime",
    "endTime",
    "phone",
  ].includes(field);
  return (
    <View className={className}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1">
          {label}
        </Text>
      </View>
      {multiline ? (
        <View
          className={`bg-gray-50 rounded-[22px] p-5 min-h-[120px] border ${error ? "border-red-500" : "border-transparent"}`}
        >
          <TextInput
            multiline
            placeholder={place}
            className="text-gray-900 font-semibold text-lg text-start"
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
            value={val}
            onChangeText={(text) => updateForm(field, text)}
          />
        </View>
      ) : (
        <Input
          className={`h-16 rounded-[22px] bg-gray-50 border px-5 ${error ? "border-red-500" : "border-transparent"}`}
        >
          <InputField
            placeholder={place}
            keyboardType={isNumeric ? "number-pad" : "default"}
            className="font-semibold text-lg text-gray-800"
            value={val}
            onChangeText={(text) => updateForm(field, text)}
          />
          {IconComp && (
            <InputSlot className="pr-2">
              <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
                <IconComp
                  size={22}
                  color={onIconPress ? "#4F46E5" : "#1F2937"}
                />
              </TouchableOpacity>
            </InputSlot>
          )}
        </Input>
      )}
      {error && (
        <Text className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">
          {error}
        </Text>
      )}
    </View>
  );
};

const RowField = ({
  label1,
  place1,
  val1,
  field1,
  icon1,
  onIconPress1,
  error1,
  label2,
  place2,
  val2,
  field2,
  icon2,
  onIconPress2,
  error2,
  updateForm,
}: any) => (
  <View className="flex-row gap-4">
    <FormField
      label={label1}
      place={place1}
      val={val1}
      field={field1}
      icon={icon1}
      onIconPress={onIconPress1}
      error={error1}
      className="flex-1"
      updateForm={updateForm}
    />
    <FormField
      label={label2}
      place={place2}
      val={val2}
      field={field2}
      icon={icon2}
      onIconPress={onIconPress2}
      error={error2}
      className="w-1/3"
      updateForm={updateForm}
    />
  </View>
);

export default function CreateEvent() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const isEditing = !!editId;
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["Limited Seats", "Certificate Provided"]);
  const [image, setImage] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    tags: tags,
  });
  const [errors, setErrors] = useState<any>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarField, setCalendarField] = useState<"startDate" | "endDate">(
    "startDate",
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeField, setTimeField] = useState<"startTime" | "endTime">(
    "startTime",
  );

  const openCalendar = (field: "startDate" | "endDate") => {
    setCalendarField(field);
    setShowCalendar(true);
  };

  const openTimePicker = (field: "startTime" | "endTime") => {
    setTimeField(field);
    setShowTimePicker(true);
  };

  const handleSelectDate = (date: Date) => {
    const formatted = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
    updateForm(calendarField, formatted);
    setShowCalendar(false);
  };

  const handleSelectTime = (time: string) => {
    updateForm(timeField, time);
    setShowTimePicker(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (index: number) =>
    setTags(tags.filter((_, i) => i !== index));

  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled && result.assets[0].base64)
        setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } catch {
      Alert.alert("Error", "Could not pick image");
    } finally {
      setIsPicking(false);
    }
  };

  React.useEffect(() => {
    if (isEditing)
      (async () => {
        try {
          const {
            data: { success, event: ev },
          } = await apiClient.get(`/events/${editId}`);
          if (success) {
            const sDate = new Date(ev.startDate),
              eDate = new Date(ev.endDate);
            setForm({
              title: ev.title,
              startDate: sDate.toLocaleDateString(),
              startTime: sDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              endDate: eDate.toLocaleDateString(),
              endTime: eDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              location: ev.location,
              description: ev.description,
              tags: ev.tags,
            });
            setTags(ev.tags);
            if (ev.image) setImage(ev.image);
          }
        } catch {
          Alert.alert("Error", "Could not load event details.");
        }
      })();
  }, [editId]);

  const parseDate = (dStr: string, tStr: string) => {
    const dParts = dStr.split("/");
    if (dParts.length !== 3) return new Date(NaN);

    const month = parseInt(dParts[0], 10) - 1;
    const day = parseInt(dParts[1], 10);
    const year = parseInt(dParts[2], 10);

    const tParts = (tStr || "00:00").split(":");
    const hour = parseInt(tParts[0], 10) || 0;
    const minute = parseInt(tParts[1], 10) || 0;

    const date = new Date(year, month, day, hour, minute);
    return date;
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    const showAlert = (title: string, message: string) =>
      Platform.OS === "web"
        ? alert(`${title}\n\n${message}`)
        : Alert.alert(title, message);

    const newErrors: any = {};
    ["title", "startDate", "startTime", "endDate", "endTime", "location", "description"].forEach(f => {
      if (!form[f as keyof typeof form]) newErrors[f] = "Required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    setErrors({});

    try {
      setIsPublishing(true);
      const sDate = parseDate(form.startDate, form.startTime),
        eDate = parseDate(form.endDate, form.endTime);
      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
        showAlert(
          "Invalid Dates",
          "Please enter valid dates in mm/dd/yyyy format",
        );
        return;
      }

      const payload = {
        ...form,
        startDate: sDate,
        endDate: eDate,
        tags,
        image: image || undefined,
      };
      const { data } = isEditing
        ? await apiClient.put(`/events/${editId}`, payload)
        : await apiClient.post("/events", payload);

      if (data.success) {
        setSuccessMessage(
          isEditing
            ? "Event updated successfully!"
            : "Event published successfully!",
        );
        setShowSuccessModal(true);
      } else showAlert("Error", data.message || "Something went wrong");
    } catch (error: any) {
      showAlert(
        "Error",
        error.response?.data?.message || "An error occurred during publishing",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const updateForm = (field: string, text: string) => {
    let formattedText = text;

    if (field === "startDate" || field === "endDate") {
      const digits = text.replace(/\D/g, "");
      if (digits.length <= 2) formattedText = digits;
      else if (digits.length <= 4)
        formattedText = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      else
        formattedText = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (field === "startTime" || field === "endTime") {
      const digits = text.replace(/\D/g, "");
      if (digits.length <= 2) formattedText = digits;
      else formattedText = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }

    setForm((prev) => ({ ...prev, [field]: formattedText }));
    if (errors[field]) setErrors(({ [field]: _, ...rest }: any) => rest);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: Platform.OS === "ios" ? 70 : 60,
            paddingBottom: 10,
          }}
        >
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-4xl font-black text-gray-900 leading-tight flex-1">
              {isEditing ? "Edit Event" : "New Event"}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-100 p-3 rounded-full ml-4"
            >
              <X size={24} color="#1F2937" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-base mb-8">
            Fill in the details to curate your campus experience.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImage}
            disabled={isPicking}
            className="w-full h-48 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center mb-10 overflow-hidden"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <>
                <View className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 mb-2">
                  <Camera size={28} color="white" />
                </View>
                <Text className="text-gray-500 font-bold">
                  {isPicking ? "Loading..." : "Add a cover photo"}
                </Text>
              </>
            )}
            {image && (
              <View className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full">
                <Camera size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <VStack space="xl">
            <FormField
              label="Event Title"
              place="e.g., Design Symposium"
              val={form.title}
              field="title"
              updateForm={updateForm}
              error={errors.title}
            />
            <RowField
              label1="Start Date"
              place1="mm/dd/yyyy"
              val1={form.startDate}
              field1="startDate"
              icon1={CalendarIcon}
              onIconPress1={() => openCalendar("startDate")}
              error1={errors.startDate}
              label2="Time"
              place2="00:00"
              val2={form.startTime}
              field2="startTime"
              icon2={Clock}
              onIconPress2={() => openTimePicker("startTime")}
              error2={errors.startTime}
              updateForm={updateForm}
            />
            <RowField
              label1="End Date"
              place1="mm/dd/yyyy"
              val1={form.endDate}
              field1="endDate"
              icon1={CalendarIcon}
              onIconPress1={() => openCalendar("endDate")}
              error1={errors.endDate}
              label2="Time"
              place2="00:00"
              val2={form.endTime}
              field2="endTime"
              icon2={Clock}
              onIconPress2={() => openTimePicker("endTime")}
              error2={errors.endTime}
              updateForm={updateForm}
            />
            <FormField
              label="Venue / Location"
              place="Innovation Hub, Room 402"
              val={form.location}
              field="location"
              icon={MapPin}
              updateForm={updateForm}
              error={errors.location}
            />
            <FormField
              label="About the Event"
              place="Describe your event here..."
              val={form.description}
              field="description"
              multiline={true}
              updateForm={updateForm}
              error={errors.description}
            />

            <View>
              <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">
                Event Tags
              </Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5 mb-4">
                <InputField
                  placeholder="Add tag (e.g. Workshop)"
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  className="font-semibold text-lg text-gray-800"
                />
                <TouchableOpacity
                  onPress={addTag}
                  className="bg-indigo-100 p-2 rounded-xl"
                >
                  <Plus size={20} color="#4F46E5" />
                </TouchableOpacity>
              </Input>
              <View className="flex-row flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100"
                  >
                    <Text className="text-indigo-600 font-bold mr-2">
                      {tag}
                    </Text>
                    <TouchableOpacity onPress={() => removeTag(index)}>
                      <X size={14} color="#4F46E5" strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </VStack>

          <View className="px-0 mt-3 mb-5 bg-white">
            <TouchableOpacity
              onPress={handlePublish}
              activeOpacity={0.8}
              disabled={isPublishing}
              className={`${isPublishing ? "bg-indigo-300" : "bg-indigo-600"} p-5 rounded-[30px] shadow-indigo-300 shadow-xl`}
            >
              <Text className="text-white text-center font-bold text-xl">
                {isPublishing
                  ? "Publishing..."
                  : isEditing
                    ? "Update Event"
                    : "Publish Event"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <CalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelectDate={handleSelectDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      <TimeModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelectTime={handleSelectTime}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => router.replace("/events")}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-emerald-50 p-6 rounded-full mb-6">
              <CheckCircle2 size={48} color="#10B981" strokeWidth={2.5} />
            </View>
            <Text className="text-3xl font-black text-gray-900 mb-3 text-center">
              Excellent!
            </Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              {successMessage}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/events")}
              className="w-full bg-emerald-600 p-5 rounded-3xl shadow-lg shadow-emerald-100"
            >
              <Text className="text-white font-bold text-center text-xl">
                Continue to Events
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer />
    </KeyboardAvoidingView>
  );
}
