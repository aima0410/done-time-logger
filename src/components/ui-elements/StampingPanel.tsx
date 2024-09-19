// ---- React ----
import { useState, useEffect } from 'react';
// ---- Types ----
import AppStatus from 'src/types/AppStatus';
import LogData from 'src/types/LogData';

// ========== 型定義 ==========
interface Props {
  switchAppStatus: (newMode: AppStatus) => void;
  timedActivity: string;
  trackTimedActivity: (newTimedActivity: string | null) => void;
}

// ========== コンポーネント関数 ==========
export default function StampingPanel({
  switchAppStatus,
  timedActivity,
  trackTimedActivity,
}: Props) {
  // -------- useState：宣言 --------
  const [isHoverMessage, setIsHoverMessage] = useState(false);
  // {isHoverMessage && <p>記録後に履歴から編集できるよ！</p>}
  const [enteredEndTime, setEnteredEndTime] = useState<string>('');
  const [timedLog, setTimedLog] = useState<LogData>({
    date: '',
    activity: '',
    startTime: '',
    endTime: '',
  });

  // -------- イベントハンドラ --------
  const handleMouseHover = (boo: boolean) => {
    setIsHoverMessage(boo);
  };

  const handleChangeEndTimeInput = (newEndTime: string) => {
    setEnteredEndTime(newEndTime);
  };

  const handleClickGetNowTimeButton = () => {
    const currentDate = new Date();
    const nowTime = currentDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setEnteredEndTime(nowTime);
  };

  const handleClickCancelTimerButton = () => {
    trackTimedActivity(null);
    switchAppStatus('StandbyMode');
  };

  const handleClickCompleteTimerButton = () => {
    const endTime = enteredEndTime;
    const newLog = { ...timedLog, endTime: endTime };

    // ローカルストレージに保存
    const storedLogs = localStorage.getItem('logs');
    const logs = storedLogs ? JSON.parse(storedLogs) : [];
    logs.push(newLog);
    localStorage.setItem('logs', JSON.stringify(logs));

    trackTimedActivity(null);
    switchAppStatus('StandbyMode');
  };

  // -------- useEffect：初回マウント時の処理 --------
  useEffect(() => {
    // ---- 日時 ----
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const defaultTime = currentDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
    // ！！！！！ここで本当はログから前回の記録データを引っ張り出して、前回の終了時刻と今回の開始時刻が被らないようにしたい。
    const startTime = defaultTime;
    // ！！！！！開始時刻より遅い時刻にしたい。
    // ！！！！！23：59を超える場合はログを2つに分割したい。日付で分ける。
    const defaultEnteredEndTime = defaultTime;

    const newLog: LogData = {
      ...timedLog,
      date: date,
      activity: timedActivity,
      startTime: startTime,
    };

    setEnteredEndTime(defaultEnteredEndTime);
    setTimedLog(newLog);
  }, []);

  // -------- JSX --------
  return (
    <>
      <section>
        <table
          onMouseEnter={() => {
            handleMouseHover(true);
          }}
          onMouseLeave={() => {
            handleMouseHover(false);
          }}
        >
          <tbody>
            <tr>
              <th>活動内容</th>
              <td>{timedActivity}</td>
            </tr>
            <tr>
              <th>日　　程</th>
              <td>{timedLog.date}</td>
            </tr>
            <tr>
              <th>開始時刻</th>
              <td>{timedLog.startTime}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <p>終了時刻</p>
          <input
            type="time"
            value={enteredEndTime}
            onChange={(e) => {
              const newEndTime = e.target.value;
              handleChangeEndTimeInput(newEndTime);
            }}
          />
          <button onClick={handleClickGetNowTimeButton}>いま</button>
        </div>
        <button onClick={handleClickCancelTimerButton}>キャンセル</button>
        <button onClick={handleClickCompleteTimerButton}>タイマー終了</button>
      </section>
    </>
  );
}
